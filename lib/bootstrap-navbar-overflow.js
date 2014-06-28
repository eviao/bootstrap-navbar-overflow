(function ($) {

    var ins,
        defaults = {
            limit: 5,

            /*dropdown or scroll*/
            type: 'scroll',
            duration: 300,

            /*scroll options*/
            forwardText: '<span class="hidden-xs glyphicon glyphicon-chevron-left"></span><span class="visible-xs glyphicon glyphicon-chevron-up"></span>',
            backwardText: '<span class="hidden-xs glyphicon glyphicon-chevron-right"></span><span class="visible-xs glyphicon glyphicon-chevron-down"></span>',

            /*dropdown options*/
            moreText: '<span class="glyphicon glyphicon-align-justify"></span> More',
            divider: 3
        };


    var NavbarOverflow = {
        init: function () {
            ins.children = ins.find("li");

            switch (ins.options.type) {
                case 'scroll':
                    Scroll.init();
                    break;
                case 'dropdown':
                    Dropdown.init();
                    break;
                default:
                    throw Error('option type["' + ins.options.type + '"] is unknown');
            }
        }
    };
    
    var Scroll = {
        init: function () {
            ins.current = 1;

            var childrenSize = ins.children.size();
            ins.panelNumber = childrenSize % ins.options.limit == 0 ?
                childrenSize / ins.options.limit : parseInt(childrenSize / ins.options.limit) + 1;

            if (ins.panelNumber > 1)
                this.change(ins.current);
        },
        render: function () {
            var self = this;

            if (!ins.forward) {
                ins.forward = $('<li class="navbar-overflow-forward"><a href="#">' + ins.options.forwardText + '</a></li>');
                $(ins.forward).find("a").on("click", function (e) {
                    e.preventDefault();
                    self.change(ins.current - 1);
                });
                ins.prepend(ins.forward);
            }
            if (ins.current > 1) {
                ins.forward.fadeIn(ins.options.duration);
            } else {
                ins.forward.hide();
            }

            if (!ins.backward) {
                ins.backward = $('<li class="navbar-overflow-backward"><a href="#">' + ins.options.backwardText + '</a></li>');
                $(ins.backward).find("a").on("click", function (e) {
                    e.preventDefault();
                    self.change(ins.current + 1);
                });
                ins.append(ins.backward);
            }
            if (ins.current < ins.panelNumber) {
                ins.backward.fadeIn(ins.options.duration);
            } else {
                ins.backward.hide();
            }
        },
        change: function (target) {
            if (target == 0 || target > ins.panelNumber) return;

            ins.children.hide();

            var start = ins.options.limit * (target - 1),
                end = start + ins.options.limit;
            $.each(ins.children, function (i, ele) {
                if (i >= start && i < end) {
                    $(ele).fadeIn(ins.options.duration);
                }
            });

            ins.current = target;
            if (ins.panelNumber > 1)
                this.render();
        }
    };

    var Dropdown = {
        init: function () {
            this.create();
        },
        create: function () {
            var dropdown = $('<li class="dropdown dropdown-more">' +
                '<a href="#" class="dropdown-toggle" data-toggle="dropdown">' +
                ins.options.moreText + ' <b class="caret"></b>' +
                '</a>' +
                '<ul class="dropdown-menu"></ul>' +
                '</li>').appendTo(ins);

            var offLimits = ins.children.slice(ins.options.limit, ins.children.size()).hide();
            var moreMenus = dropdown.find('ul.dropdown-menu');

            $.each(offLimits, function (i, ele) {
                if (i > 0 && ins.options.divider > 0 && i % ins.options.divider == 0) {
                    moreMenus.append('<li class="divider"></li>');
                }

                var item = $(ele).clone(true).removeAttr('style');

                moreMenus.append(item);
            })
        }
    };

    $.fn.navbarOverflow = function (opts) {
        ins = this;

        this.options = $.extend(true, {}, defaults, opts);

        NavbarOverflow.init();
    };

})(jQuery)