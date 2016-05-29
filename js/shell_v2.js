var bdShare = bdShare || {
    version: "1.0" //default object and default property
};
bdShare.ready = bdShare.ready || function(B, C) {
   localDocument=localDocument|| document;
    if (/complete/.test(localDocument.readyState)) {
        B()
    } else {
        if (localDocument.addEventListener) {
            if ("interactive" == localDocument.readyState) {
                B()
            } else {
                localDocument.addEventListener("DOMContentLoaded", B, false)
            }
        } else {
            var A = function() {
                A = new Function;
                B()
            };
            void
            function() {
                try {
                    localDocument.body.doScroll("left")
                } catch (D) {
                    return setTimeout(arguments.callee, 10)
                }
                A()
            }();
            localDocument.attachEvent("onreadystatechange", function() {
                ("complete" == localDocument.readyState) && A()
            })
        }
    }
};
bdShare.loadScript = bdShare.loadScript || function(B) {
    var createdScript = document.createElement("script");
    created.src = B;//B it is source of script
    bdShare.ready(function() {
        document.getElementsByTagName("script")[0].parentNode.appendChild(A)
    })
};
if (bdShare.fn && bdShare.fn.init) {
    bdShare.fn.init()
} else {
    bdShare.velocity = {
        start: +new Date
    };
    if (!bdShare.ApiPVLogger) {
      // External script? WTF&
        bdShare.loadScript("http://bdimg.share.baidu.com/static/js/logger.js?cdnversion=" + Math.ceil(new Date() / 3600000))
    }
    // External script? WTF
    document.getElementById("bdshare_js").src = "http://bdimg.share.baidu.com/static/js/bds_s_v2.js?cdnversion=" + Math.ceil(new Date() / 3600000)
}
//  WTF
if (+[1, ]) {
    var shell = document.getElementById("bdshell_js");
    shell && shell.parentNode.removeChild(shell)
};
