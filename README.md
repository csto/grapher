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

In your application.js file:

  //= require grapher/grapher

In your application.css file:

  //= require grapher/grapher

== Basic Usage

Add this helper method to any view.  It will output a time graph of the Model's created at by day.

  <%= graph("day") do |g| %>
    <% g.line(Model) %>
  <% end %>

Line takes any active model relation.

	<%= graph("day") do |g| %>
    <% g.line(User.where(:registered => true)) %>
  <% end %>

You can have multiple lines per graph.

	<%= graph("day") do |g| %>
    <% g.line(User.where(:registered => true)) %>
		<% g.line(User.where(:registered => false)) %>
  <% end %>

The first param can be "month", "day" or "hour".

	<%= graph("hour") do |g| %>
    <% g.line(User) %>
  <% end %>

or

	<%= graph("day") do |g| %>
    <% g.line(User) %>
  <% end %>

or

	<%= graph("month") do |g| %>
	  <% g.line(User) %>
	<% end %>

== Line Options

	<%= graph("month") do |g| %>
    <% g.line(User){|r| r.average} %>
  <% end %>

== Graph Options



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