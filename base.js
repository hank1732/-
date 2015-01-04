/*基础函数*/
Base = {};
Base.hasClass = function (obj, cls) {
    return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}
Base.addClass = function (obj, cls) {
    if (!this.hasClass(obj, cls)) obj.className += " " + cls;
}
Base.removeClass = function (obj, cls) {
    if (Base.hasClass(obj, cls)) {
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        obj.className = obj.className.replace(reg, '');
    }
}
Base.toggleClass = function (obj, cls){
	if (!Base.hasClass(obj, cls)){
		Base.addClass(obj, cls);
	}else{
		Base.removeClass(obj, cls);
	}
	console.debug("目标被点击");
}
Base.getE = function (query){
	return document.getElementById(query);
}
Base.onClick = function (dom,handler){
	if(dom.addEventListener)
		dom.addEventListener("click",handler,false);
	else if(dom.attachHaattachEventdler)
		dom.attachEvent('onclick',handler)
	else
		dom['onclick'] = null;
}
Base.getChildren = function (node){
    var child=node.childNodes;
    var result=[];
    for(var i=0;i<child.length;i++){
        if(child[i].nodeType==1){
            result.push(child[i]);
        }
    }
    return result;
}