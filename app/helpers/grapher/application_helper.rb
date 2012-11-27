module Grapher
  class Graph
    include ActionView::Helpers::TagHelper
    include ActionView::Helpers::JavaScriptHelper

    def initialize(options={}, block)
      block.call(self)
    end

    def line(relation)
      @data ||= []
      @data << relation
    end

    def html
      div_class = 'graph-' + rand(9999999).to_s

      content_tag(:div, nil, :class => div_class) +
      javascript_tag("new Graph.LineGraph(" + div_class.to_json + "," + @data.to_json + ")")
    end
  end

  module ApplicationHelper

    def graph(time, options={}, &block)
      return Grapher::Graph.new(options, block).html
    end

  end
end
