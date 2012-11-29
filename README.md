= Grapher

Grapher creates interactive time graphs simply by passing in Active Record Relations to a helper method.

== Installation

=== Rails 3

You can let bundler install Grapher by adding this line to your application's Gemfile:

  gem 'grapher'

And then execute:

  bundle install

Or install it yourself with:

  gem install grapher

== Assets

In your application.css file:

  //= require grapher/grapher

== Basic Usage


```html
  <%= graph("day") do |g| %>
    <% g.line(Model) %>
  <% end %>
```

== Styling the Graph

Change the color

.line-0{
  stroke:red !important;
}
.grapher-circle-0, .grapher-label-0{
  fill:red !important;
}

graph options
  - time > "hour", "day", "month" *required
  - options
    - class
    - xinterval
    - yinterval
    - interpolate "linear" https://github.com/mbostock/d3/wiki/SVG-Shapes#wiki-line_interpolate

  - line
    - Relation
    - options
      - column
      - label

<%= graph("day") do |g| %>
	<% g.line(User) %>
	<% g.line(User){|r| r.average(:value)} %>
<% end %>