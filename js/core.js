﻿
var Core = {}; //empty object
var _cache = {}; //empty object
Core.config = { //Core object has sub Object confign with this propertyies
    shortcutTop: 20,
    shortcutLeft: 20,
    createIndexid: 1,
    windowMinWidth: 150,
    windowMinHeight: 56
};
Core.menu = {
    bodymenudata: [
        [{
            text: "Refresh",
            func: function() {
                location.reload();
            }
        }, {
            text: "Show Desktop",
            func: function() {
                Core.showDesktop();
            }
        }, {
            text: "Display Sidebar",
            func: function() {
                $("#menubar").animate({
                    right: 0
                }, 1500);
            }
        }, {
            text: "Change your background",
            data: [
                [{
                    text: "default",
                    func: function() {
                      // here IMG!
                        $(this).attr("style", 'background:url(images/background.jpg) repeat right bottom transparent;');
                    }
                }, {
                    text: "Green Dream",
                    func: function() {
                        $(this).attr("style", 'background:url(images/background0.jpg) repeat right bottom transparent;');
                    }
                }]
            ]
        }],
        [{
            text: "author information",
            func: function() {
                window.open("http://www.zi-han.net");
            }
        }]
    ]
};
Core.init = function() { //core object has method inti that...
    $(document.body).bind('click', function() { //attach click event
        $(".popup-menu").hide(); //some tag wit class popupmenu hide at start
    });
    var _top = Core.config.shortcutTop;
    var _left = Core.config.shortcutLeft;
    var windowHeight = $("#desk").height();
    var ul = $("#desk").find('ul');
    $("#desk").bind('contextmenu', function() {
        $(".popup-menu").hide();
        $("#desk").smartMenu(Core.menu.bodymenudata, {
            name: "body"
        });
        $("#task-bar").smartMenu(Core.menu.icosmenudata, {
            name: "task_bar"
        });
        return false;
    });
    $(window).bind('load', function() {
        for (var sc in shortcut) {
            _cache.shortcutTemp = {
                "top": _top,
                "left": _left,
                "title": shortcut[sc][1],
                "shortcut": shortcut[sc][0],
                "imgsrc": shortcut[sc][2]
            };
            $(ul).append(FormatModel(shortcutTemp, _cache.shortcutTemp));
            _top += 90;
            if (_top + Core.config.shortcutTop + 57 > windowHeight) {
                _top = Core.config.shortcutTop;
                _left += 90;
            }
        }
    }).bind('resize', function() {
        if ($(window).width() < 800 || $(window).height() < 400) {
            ZENG.msgbox.show("Current browser window is too small, it may affect the normal operation!", 1, 2000);
        }
        _top = Core.config.shortcutTop;
        _left = Core.config.shortcutLeft;
        windowHeight = $("#desk").height();
        $(ul).find("li").each(function() {
            $(this).css({
                "left": _left,
                "top": _top
            });
            _top += 90;
            if (_top + Core.config.shortcutTop + 57 > windowHeight) {
                _top = Core.config.shortcutTop;
                _left += 90;
            }
        });
        $("#desk div.window-container").each(function() {
            currentW = $(window).width() - $(this).width();
            currentH = $(window).height() - $(this).height();
            _l = $(this).data("info").left / $(this).data("info").emptyW * currentW >= currentW ? currentW : $(this).data("info").left / $(this).data("info").emptyW * currentW;
            _l = _l <= 0 ? 0 : _l;
            _t = $(this).data("info").top / $(this).data("info").emptyH * currentH >= currentH ? currentH : $(this).data("info").top / $(this).data("info").emptyH * currentH;
            _t = _t <= 0 ? 0 : _t;
            $(this).css({
                "left": _l + "px",
                "top": _t + "px"
            });
        });
    }).bind('load', function() {
        $('.bgloader').fadeOut('slow');
    });
    ul.find('li').live('click', function() {
        Core.create($(this));
    });
    $('.task-window li').live('click', function() {
        Core.taskwindow($(this));
    }).live('contextmenu', function() {
        Core.taskwindowrightmenu($(this));
        return false;
    });
    $('.window-container').live('click', function() {
        Core.container($(this));
    });
};
Core.create = function(obj, opt) {
    if (typeof(obj) === 'string') {
        var options = {
            num: Date.parse(new Date()),
            imgsrc: "images/shortcut/news.png",
            title: opt.title,
            url: opt.url,
            width: opt.width,
            height: opt.height,
            resize: opt.resize
        };
    } else {
        var sc = obj.attr('shortcut');
        var options = {
            num: shortcut[sc][0],
            title: shortcut[sc][1],
            imgsrc: shortcut[sc][2],
            url: shortcut[sc][3],
            width: shortcut[sc][4],
            height: shortcut[sc][5],
            resize: true
        };
    }
    var window_warp = 'window_' + options.num + '_warp';
    var window_inner = 'window_' + options.num + '_inner';
    var iswindowopen = 0;
    $('.task-window li').each(function() {
        if ($(this).attr('window') == options.num) {
            iswindowopen = 1;
            $('.task-window li b').removeClass('focus');
            $(this).children('b').addClass('focus');
            $('.window-container').removeClass('window-current');
            $('#' + window_warp).addClass('window-current').css({
                'z-index': Core.config.createIndexid
            }).show();
            $('.window-frame').children('div').show();
            $('#' + window_inner + ' .window-frame').children('div').hide();
            Core.config.createIndexid += 1;
        }
    });
    if (iswindowopen == 0) {
        _cache.MoveLayOut = GetLayOutBox();
        _cache.MoveLayOut.show();
        $('.window-frame').children('div').show();
        $('.task-window li b').removeClass('focus');
        $('.window-container').removeClass('window-current');
        _cache.taskTemp = {
            "num": options.num,
            "title": options.title,
            "imgsrc": options.imgsrc
        };
        var top = ($(window).height() - options.height - 30) / 2 <= 0 ? 0 : ($(window).height() - options.height - 30) / 2;
        var left = ($(window).width() - options.width) / 2 <= 0 ? 0 : ($(window).width() - options.width) / 2;
        _cache.windowTemp = {
            "width": options.width,
            "height": options.height,
            "top": top,
            "left": left,
            "emptyW": $(window).width() - options.width,
            "emptyH": $(window).height() - options.height,
            "zIndex": Core.config.createIndexid,
            "num": options.num,
            "title": options.title,
            "url": options.url
        };
        _cache.resizeTemp = {
            "t": "left:0;top:-3px;width:100%;height:5px;z-index:1;cursor:n-resize",
            "r": "right:-3px;top:0;width:5px;height:100%;z-index:1;cursor:e-resize",
            "b": "left:0;bottom:-3px;width:100%;height:5px;z-index:1;cursor:s-resize",
            "l": "left:-3px;top:0;width:5px;height:100%;z-index:1;cursor:w-resize",
            "rt": "right:-3px;top:-3px;width:10px;height:10px;z-index:2;cursor:ne-resize",
            "rb": "right:-3px;bottom:-3px;width:10px;height:10px;z-index:2;cursor:se-resize",
            "lt": "left:-3px;top:-3px;width:10px;height:10px;z-index:2;cursor:nw-resize",
            "lb": "left:-3px;bottom:-3px;width:10px;height:10px;z-index:2;cursor:sw-resize"
        };
        $('.task-window').append(FormatModel(taskTemp, _cache.taskTemp));
        var win_warp = "";
        if (options.resize) {
            for (var k in _cache.resizeTemp) {
                win_warp += FormatModel(resizeTemp, {
                    resize_type: k,
                    css: _cache.resizeTemp[k]
                });
            }
        }
        win_warp = FormatModel(FormatModel(windowTemp, {
            resize: win_warp
        }), _cache.windowTemp);
        $('#desk').append(win_warp);
        $("#" + window_warp).data("info", _cache.windowTemp);
        Core.config.createIndexid += 1;
        Core.bindWindowMove($('#' + window_warp));
        if (options.resize) {
            Core.bindWindowResize($('#' + window_warp));
        }
        Core.handle($('#' + window_warp));
        _cache.MoveLayOut.hide();
    }
};
Core.taskwindow = function(obj) {
    var window_warp = 'window_' + obj.attr('window') + '_warp';
    var window_inner = 'window_' + obj.attr('window') + '_inner';
    if (obj.children('b').hasClass('focus')) {
        obj.children('b').removeClass('focus');
        $('#' + window_warp).hide();
    } else {
        $('.task-window li b').removeClass('focus');
        obj.children('b').addClass('focus');
        $('.window-container').removeClass('window-current');
        $('#' + window_warp).addClass('window-current').css({
            'z-index': Core.config.createIndexid
        }).show();
        $('.window-frame').children('div').show();
        $('#' + window_inner + ' .window-frame').children('div').hide();
        Core.config.createIndexid += 1;
    }
};
Core.taskwindowsystemmenu = function(obj) {
    _cache.TaskSystem = GetTaskSystem(obj);
    _cache.TaskSystem.css({
        right: '2px'
    }).show();
};
Core.container = function(obj) {
    $('.task-window li b').removeClass('focus');
    $('.task-window li[window="' + obj.attr('window') + '"] b').addClass('focus');
    $('.window-container').removeClass('window-current');
    obj.addClass('window-current').css({
        'z-index': Core.config.createIndexid
    });
    $('.window-frame').children('div').show();
    obj.find('.window-frame').children('div').hide();
    Core.config.createIndexid += 1;
};
Core.handle = function(obj) {
    $('.window-container').removeClass('window-current');
    obj.addClass('window-current').css({
        'z-index': Core.config.createIndexid
    });
    Core.config.createIndexid += 1;
    obj.find(".ha-min").bind("click", function(e) {
        e.stopPropagation();
        obj.hide();
        $('.task-window li[window="' + obj.attr('window') + '"] b').removeClass('focus');
    });
    obj.find(".ha-max").bind("click", function(e) {
        obj.css({
            width: "100%",
            height: "100%",
            top: 0,
            left: 0
        });
        $(this).hide().next(".ha-revert").show();
        ie6iframeheight();
        ZENG.msgbox.show("按F11体验浏览器全屏模式！", 4, 2000);
    });
    obj.find(".ha-revert").bind("click", function(e) {
        obj.css({
            width: obj.data("info").width + "px",
            height: obj.data("info").height + "px",
            left: obj.data("info").left + "px",
            top: obj.data("info").top + "px"
        });
        $(this).hide().prev(".ha-max").show();
        ie6iframeheight();
    });
    obj.find(".title-bar").bind("dblclick", function(e) {
        if ($(this).find(".ha-max").is(":visible")) {
            $(this).find(".ha-max").click();
        } else {
            $(this).find(".ha-revert").click();
        }
    });
    obj.find(".ha-close").bind("click", function(e) {
        $('.task-window li[window="' + obj.attr('window') + '"]').remove();
        obj.remove();
    });
    obj.find("#refresh").bind("click", function(e) {
        $("#frame" + obj.attr('window')).attr("src", $("#frame" + obj.attr('window')).attr("src"));
    });
};
Core.showDesktop = function() {
    $(".task-window li b").removeClass("focus");
    $("#desk ul").nextAll("div").hide();
};
Core.bindWindowMove = function(obj) {
    obj.find(".title-bar").bind("mousedown", function(e) {
        $('.window-container').removeClass('window-current');
        obj.addClass('window-current').css({
            'z-index': Core.config.createIndexid
        });
        Core.config.createIndexid += 1;
        x = e.screenX;
        y = e.screenY;
        sT = obj.offset().top;
        sL = obj.offset().left;
        _cache.MoveLayOut = GetLayOutBox();
        var lay = ($.browser.msie) ? _cache.MoveLayOut : $(window);
        lay.unbind("mousemove").bind("mousemove", function(e) {
            _cache.MoveLayOut.show();
            obj.find(".ha-revert").hide().prev(".ha-max").show();
            eX = e.screenX;
            eY = e.screenY;
            lessX = eX - x;
            lessY = eY - y;
            _l = sL + lessX;
            _t = sT + lessY;
            _w = obj.data("info").width;
            _h = obj.data("info").height;
            if (_t <= 10) {
                _t = 0;
            }
            if (_l <= 10) {
                _l = 0;
            }
            if (_l >= lay.width() - _w - 10) {
                _l = lay.width() - _w;
            }
            if (_t >= lay.height() - _h - 30 - 10) {
                _t = lay.height() - _h - 30;
            }
            obj.css({
                width: _w,
                height: _h,
                left: _l,
                top: _t
            });
            obj.data("info", {
                width: obj.data("info").width,
                height: obj.data("info").height,
                left: obj.offset().left,
                top: obj.offset().top,
                emptyW: $(window).width() - obj.data("info").width,
                emptyH: $(window).height() - obj.data("info").height
            });
            ie6iframeheight();
        });
        lay.unbind("mouseup").bind("mouseup", function() {
            _cache.MoveLayOut.hide();
            if ($.browser.msie) {
                _cache.MoveLayOut[0].releaseCapture();
            }
            $(this).unbind("mousemove");
        });
        if ($.browser.msie) {
            _cache.MoveLayOut[0].setCapture();
        }
    });
};
Core.bindWindowResize = function(obj) {
    for (rs in _cache.resizeTemp) {
        bindResize(rs);
    }

    function bindResize(r) {
        obj.find("div[resize='" + r + "']").bind("mousedown", function(e) {
            _cache.MoveLayOut = GetLayOutBox();
            var lay = ($.browser.msie) ? _cache.MoveLayOut : $(window);
            cy = e.clientY;
            cx = e.clientX;
            h = obj.height();
            w = obj.width();
            _cache.MoveLayOut = GetLayOutBox();
            lay.unbind("mousemove").bind("mousemove", function(e) {
                _cache.MoveLayOut.show();
                _t = e.clientY;
                _l = e.clientX;
                if (_t <= 10) {
                    _t = 0;
                }
                if (_t >= (lay.height() - 60)) {
                    _t = (lay.height() - 60);
                }
                if (_l <= 1) {
                    _l = 1;
                }
                if (_l >= (lay.width() - 2)) {
                    _l = (lay.width() - 2);
                }
                $('.window-frame').children('div').hide();
                obj.find('.window-frame').children('div').show();
                switch (r) {
                    case "t":
                        if (h + cy - _t > Core.config.windowMinHeight) {
                            obj.css({
                                height: (h + cy - _t) + "px",
                                top: _t + "px"
                            });
                        }
                        break;
                    case "r":
                        if (w - cx + _l > Core.config.windowMinWidth) {
                            obj.css({
                                width: (w - cx + _l) + "px"
                            });
                        }
                        break;
                    case "b":
                        if (h - cy + _t > Core.config.windowMinHeight) {
                            obj.css({
                                height: (h - cy + _t) + "px"
                            });
                        }
                        break;
                    case "l":
                        if (w + cx - _l > Core.config.windowMinWidth) {
                            obj.css({
                                width: (w + cx - _l) + "px",
                                left: _l + "px"
                            });
                        }
                        break;
                    case "rt":
                        if (h + cy - _t > Core.config.windowMinHeight) {
                            obj.css({
                                height: (h + cy - _t) + "px",
                                top: _t + "px"
                            });
                        }
                        if (w - cx + _l > Core.config.windowMinWidth) {
                            obj.css({
                                width: (w - cx + _l) + "px"
                            });
                        }
                        break;
                    case "rb":
                        if (w - cx + _l > Core.config.windowMinWidth) {
                            obj.css({
                                width: (w - cx + _l) + "px"
                            });
                        }
                        if (h - cy + _t > Core.config.windowMinHeight) {
                            obj.css({
                                height: (h - cy + _t) + "px"
                            });
                        }
                        break;
                    case "lt":
                        if (w + cx - _l > Core.config.windowMinWidth) {
                            obj.css({
                                width: (w + cx - _l) + "px",
                                left: _l + "px"
                            });
                        }
                        if (h + cy - _t > Core.config.windowMinHeight) {
                            obj.css({
                                height: (h + cy - _t) + "px",
                                top: _t + "px"
                            });
                        }
                        break;
                    case "lb":
                        if (w + cx - _l > Core.config.windowMinWidth) {
                            obj.css({
                                width: (w + cx - _l) + "px",
                                left: _l + "px"
                            });
                        }
                        if (h - cy + _t > Core.config.windowMinHeight) {
                            obj.css({
                                height: (h - cy + _t) + "px"
                            });
                        }
                        break;
                }
                ie6iframeheight();
                obj.data("info", {
                    width: obj.width(),
                    height: obj.height(),
                    left: obj.offset().left,
                    top: obj.offset().top,
                    emptyW: $(window).width() - obj.width(),
                    emptyH: $(window).height() - obj.height()
                });
            });
            lay.unbind("mouseup").bind("mouseup", function() {
                _cache.MoveLayOut.hide();
                if ($.browser.msie) {
                    _cache.MoveLayOut[0].releaseCapture();
                }
                $(this).unbind("mousemove");
            });
            if ($.browser.msie) {
                _cache.MoveLayOut[0].setCapture();
            }
        });
    }
};
var GetLayOutBox = function() {
    if (!_cache.LayOutBox) {
        _cache.LayOutBox = $('<div style="z-index:99999;display:none;cursor:default;background:none;height:100%;left:0;position:absolute;top:0;width:100%;filter:alpha(opacity=0);-moz-opacity:0;opacity:0"><div style="height:100%;width:100%"></div></div>');
        $(document.body).append(_cache.LayOutBox);
    }
    return _cache.LayOutBox;
}
var GetTaskRight = function(obj) {
    if (!_cache.TaskRight) {
        _cache.TaskRight = $('<div class="popup-menu task-menu" style="z-index:99999;bottom:30px;display:none"><ul><li><a menu="close" title="关闭" href="javascript:;">关闭</a></li></ul></div>');
        $(document.body).append(_cache.TaskRight);
        $('.task-menu').bind('contextmenu', function() {
            return false;
        });
    }
    $('.task-menu a[menu="close"]').unbind("click").bind("click", function() {
        $('#window_' + obj.attr('window') + '_inner .title-handle .ha-close').click();
        $('.task-menu').hide();
    });
    return _cache.TaskRight;
}
var GetTaskSystem = function(obj) {
    if (!_cache.TaskSystem) {
        _cache.TaskSystem = $('<div class="popup-menu task-menu" style="z-index:99999;bottom:30px;display:none"><ul><li><a menu="close" href="javascript:;">用户登录</a></li><li><a menu="close" href="javascript:;">用户登录</a></li></ul></div>');
        $(document.body).append(_cache.TaskSystem);
        $('.task-menu').bind('contextmenu', function() {
            return false;
        });
    }
    $('.task-menu a[menu="close"]').unbind("click").bind("click", function() {
        $('#window_' + obj.attr('window') + '_inner .title-handle .ha-close').click();
        $('.task-menu').hide();
    });
    return _cache.TaskSystem;
}
var FormatModel = function(str, model) {
    for (var k in model) {
        var re = new RegExp("{" + k + "}", "g");
        str = str.replace(re, model[k]);
    }
    return str;
}
var ie6iframeheight = function() {
    if ($.browser.msie && $.browser.version === "6.0") {
        $('.window-frame').css("height", ($('.window-frame').parent().height() - 59) + "px");
    }
}
$().ready(function() {
    document.body.onselectstart = document.body.ondrag = function() {
        return false;
    }
    Core.init();
});
$(".second-menu li").click(function() {
    $("#start-menu").hide();
});
$(".start-menu li").mouseover(function() {
    $(".start-menu li").removeClass("menuSelected");
    $(this).addClass("menuSelected");
});
$("#desk").click(function() {
    $("#start-menu").hide();
});
$("span.startMenuBtn").click(function() {
    $("#start-menu").toggle();
});
$(".start-menu li.sm1").click(function() {
    Core.showDesktop();
});
$(".start-menu li.sm2").click(function() {
    $("#menubar").animate({
        right: 0
    }, 1500);
});
$(".start-menu li.sm4").click(function() {
    var ctrl = (navigator.userAgent.toLowerCase()).indexOf('mac') != -1 ? 'Command/Cmd' : 'CTRL';
    if (document.all) {
        window.external.addFavorite('http://www.zi-han.net', 'Sub-Han\'s blog');
    } else if (window.sidebar) {
        window.sidebar.addPanel('子涵的博客', 'http://www.zi-han.net', "");
    } else {
        ZENG.msgbox.show("Collection fails, you can try '+ ctrl +' + D Add to favorites!", 1, 5000);
    }
});
$(".start-menu li.sm5").click(function() {
    ZENG.msgbox.show("Some browsers might fail, please use the 'Save as' Download", 1, 3000);
});
$(document).ready(function() {
    $("#menubar").animate({
        right: 0
    }, 1500);
    $("#menubar span.mbot a").click(function() {
        $("#menubar").animate({
            right: "-73px"
        }, 1000);
        ZENG.msgbox.show("You can re-open the sidebar in the right-click menu or the Start menu", 1, 3000);
    });
    $("#menubar ul li").removeClass("selected");
    $("#menubar ul li").eq(GetQueryString("menu") - 1).addClass("selected");
});
$("#desk li:last").hide();
