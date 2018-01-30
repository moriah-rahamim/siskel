var Movie = Backbone.Model.extend({

  defaults: {
    like: true
  },

  toggleLike: function() {
    // negate whatever is the current value of this.like
    this.set('like', !this.get('like'));
  }

});

var Movies = Backbone.Collection.extend({

  model: Movie,

  initialize: function(data) {
    this.on('change', this.sort, this);
  },

  comparator: 'title',

  sortByField: function(field) {
    // comparator is a direct property of a collection
    // .get() and .set() are used with properties of the
    // .attributes object.
    this.comparator = field;
    this.sort();
  }

});

var AppView = Backbone.View.extend({

  events: {
    'click form input': 'handleClick'
  },

  handleClick: function(e) {
    var field = $(e.target).val();
    this.collection.sortByField(field);
  },

  render: function() {
    new MoviesView({
      el: this.$('#movies'),
      collection: this.collection
    }).render();
  }

});

var MovieView = Backbone.View.extend({

  template: _.template('<div class="movie"> \
                          <div class="like"> \
                            <button><img src="images/<%- like ? \'up\' : \'down\' %>.jpg"></button> \
                          </div> \
                          <span class="title"><%- title %></span> \
                          <span class="year">(<%- year %>)</span> \
                          <div class="rating">Fan rating: <%- rating %> of 10</div> \
                        </div>'),

  initialize: function() {
    // The model here refers to the Movie the View is based on
    this.model.on('change', this.render, this);
  },

  events: {
    'click button': 'handleClick'
  },

  handleClick: function() {
    // Call toggleLike on this View's model, e.g. its movie
    this.model.toggleLike();
  },

  render: function() {
    this.$el.html(this.template(this.model.attributes));
    return this.$el;
  }

});

var MoviesView = Backbone.View.extend({

  initialize: function() {
    // Need to bind this to this context
    this.collection.on('sort', this.render, this);
  },

  render: function() {
    this.$el.empty();
    this.collection.forEach(this.renderMovie, this);
  },

  renderMovie: function(movie) {
    var movieView = new MovieView({model: movie});
    this.$el.append(movieView.render());
  }

});
