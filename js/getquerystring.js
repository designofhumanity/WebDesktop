// what call this function?
        function  GetQueryString(name){
            var reg=new   RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
            var r=window.location.search.substr(1).match(reg);
            if(r!=null) return unescape(r[2]);return null;
        }
        //alert(GetQueryString("menu"));
        if (GetQueryString("menu")==null){
          // dynamically script inserting
            document.write( "<scri"+"pt type=text/javascript src=js/shortcut1.js>"+"</scr"+"ipt>" );
        }
        else{
          // dynamically script inserting
            document.write( "<scri"+"pt type=text/javascript src=js/shortcut"+GetQueryString("menu")+".js>"+"</scr"+"ipt>" );
        }
