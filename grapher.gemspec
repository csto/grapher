$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "grapher/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "grapher"
  s.version     = Grapher::VERSION
  s.authors     = ["Csto"]
  s.email       = ["coreystout@hotmail.com"]
  s.homepage    = ""
  s.summary     = "Simple graphing for rails."
  s.description = "Grapher creates interactive time graphs simply by passing in Active Record Relations to a helper method."

  s.files = Dir["{app,config,db,lib}/**/*"] + ["MIT-LICENSE", "Rakefile", "README.rdoc"]
  s.test_files = Dir["test/**/*"]

  s.add_dependency "rails", "~> 3.2.8"
  # s.add_dependency "jquery-rails"

  s.add_development_dependency "sqlite3"
end
