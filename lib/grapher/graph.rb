module Grapher
  class Graph
    include ActionView::Helpers::TagHelper

    def initialize(block)
      block.call(self)
    end

    def line(a)

    end

    def html
      div_class = rand(9999999)
      content_tag(:div, 'test', :class => div_class)
    end
  end
end