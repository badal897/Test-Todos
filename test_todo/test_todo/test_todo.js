(function() {
    console.log('working fine!!');

    /*Todo model*/
    var todoModel = Backbone.Model.extend({
        defaults: function() {
            return {
                title: "empty todo...",
                order: Todos.nextOrder(),
                done: false
            };
        },

        toggle: function() {
            this.set('done', !this.get("done"));
        }
    });

    /*Todo Collection*/
    var todoCollection = Backbone.Collection.extend({
        model: todoModel,
        done: function() {
            return this.where({ done: true });
        },
        remaining: function() {
            return this.where({ done: false });
        },
        nextOrder: function() {
            if (!this.length) return 1;
            return this.last().get('order') + 1;
        },
    });

    /*instantiate collection*/
    var Todos = new todoCollection;

    /*Todo View*/
    var todoView = Backbone.View.extend({
        tagName: 'li',
        template: _.template($('#itemTemplate').html()),
        events: {
            'click .toggle': 'toggleDone',
            'click .destroy': 'clearItem',
            "dblclick .view": "edit",
            "keypress .edit": "updateOnEnter",
        },
        initialize: function() {
            /*remove the view*/
            /*register this.remove to destroy event*/
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
        },
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            this.input = this.$('.edit');
            this.editLabel = this.$('.editLabel');
            return this;
        },
        toggleDone: function(e) {
            this.model.toggle();
        },
        clearItem: function(e) {
            this.model.destroy();
        },
        edit: function(e) {
            this.input.show();
            this.editLabel.hide();
        },
        updateOnEnter: function(e) {
            if (e.keyCode == 13) {
                var value = this.input.val();
                if (!value) {
                    this.clearItem();
                } else {
                    this.model.set("title", value);
                    this.input.hide();
                    this.editLabel.show();
                }
            } else {
                return;
            }
        },
    });

    /*Application View*/
    var appView = Backbone.View.extend({
        el: '#todoapp',
        events: {
            'keypress #new-todo': 'createItem'
        },
        initialize: function() {
            this.input = this.$('#new-todo');
            this.allCheckbox = this.$("#toggle-all")[0];

            //listen for this add event
            this.listenTo(Todos, 'add', this.addItem);
        },
        render: function() {
            return this;
        },
        createItem: function(e) {
            //console.log(e);
            if (e.keyCode != 13) return;
            if (!this.input.val()) return;
            Todos.add({ title: this.input.val() });
            this.input.val('');
        },
        addItem: function(currTodoModel) {
            //console.log(currTodoModel);
            var view = new todoView({ model: currTodoModel });
            this.$("#todo-list").append(view.render().el);
        }
    });

    var app = new appView;
})();