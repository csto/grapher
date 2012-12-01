$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "grapher/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "grapher"
  s.version     = Grapher::VERSION
  s.authors     = ["Corey Stout", "Ryan Stout"]
  s.email       = ["corey@zeebly.com", "ryan@zeebly.com"]
  s.homepage    = "https://github.com/csto/grapher"
  s.summary     = "Generate time series graphs in rails"
  s.description = "An easy way to generate time series graphs in rails"

  s.files = Dir["{app,config,db,lib}/**/*"] + ["MIT-LICENSE", "Rakefile", "README.rdoc"]
  s.test_files = Dir["test/**/*"]

  s.add_dependency "rails", "~> 3.2.8"
  # s.add_dependency "jquery-rails"

  s.add_development_dependency "sqlite3"
end
