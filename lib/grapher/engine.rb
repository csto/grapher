module Grapher
  class Engine < ::Rails::Engine
    # require 'grapher/graph'

    config.to_prepare do
      ApplicationController.helper(Grapher::ApplicationHelper)
    end

  end
end
