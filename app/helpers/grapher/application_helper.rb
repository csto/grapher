module Grapher
  class Graph
    include ActionView::Helpers::TagHelper
    include ActionView::Helpers::JavaScriptHelper

    def initialize(time_units, options, block)
      @time_units = time_units
      @options = options
      @driver = ActiveRecord::Base.connection.instance_values["config"][:adapter]

      if @driver =~ /postgre/
        @strf = "YYYY-MM-DD"
        if @time_units.downcase == "hour"
          @strf = "YYYY-MM-DD HH24:00"
        elsif @time_units.downcase == "month"
          @strf = "YYYY-MM-1"
        end
      else
        @strf = "%Y-%m-%d"
        if @time_units.downcase == "hour"
          @strf = "%Y-%m-%d %H:00"
        elsif @time_units.downcase == "month"
          @strf = "%Y-%m-1"
        end
      end

      block.call(self)
    end

    def line(relation, options={})


      @data ||= []
      @labels ||= []
      @column = options[:column] || "created_at"
      label = options[:label] || "Value"
      @labels << label

      if @driver =~ /mysql/
        relation = relation.group("DATE_FORMAT(#{@column}, '#{@strf}')")
      elsif @driver =~ /postgre/
        relation = relation.group("to_char(#{@column}, '#{@strf}')")
      elsif @driver =~ /sqlite/
        relation = relation.group("STRFTIME('#{@strf}', #{@column})")
      end

      if block_given?
        relation = (yield(relation))
      else
        relation = relation.count
      end

      @data << relation
    end

    def add_missing_times
      start_date = ''
      end_date = ''
      @data.each do |data|
        start_date = Time.parse(data.keys[0]) if !start_date.present? || start_date < Time.parse(data.keys[0])
        end_date = Time.parse(data.keys[data.count-1]) if !end_date.present? || end_date > Time.parse(data.keys[data.count-1])
      end

      @data.each_with_index do |data, index|
        dates = {}
        current_date = start_date
        loop do
          dates[current_date.strftime(@strf)] = data[current_date.strftime(@strf)] || 0
          current_date += 1.send(@time_units.singularize.to_sym)

          break if current_date > end_date || dates.count > 999
        end
        break if dates.count > 999
        @data[index] = dates
      end
    end

    def html
      add_missing_times
      @data.each_with_index do |data, index|
        @data[index] = data.map{|x, y| {:x => x, :y => y.to_i} }
      end
      @options[:class] ||= 'graph-' + rand(9999999).to_s

      content_tag(:div, nil, :class => @options[:class]) +
      javascript_tag("new Graph.LineGraph(" + @data.to_json + "," + @labels.to_json + "," + @options.to_json + ")")
    end
  end

  module ApplicationHelper

    def graph(time_units, options={}, &block)
      return Grapher::Graph.new(time_units, options, block).html
    end

  end
end
