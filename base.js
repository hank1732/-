/*基础函数*/
function hasClass(obj, cls) {
    return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}
function addClass(obj, cls) {
    if (!this.hasClass(obj, cls)) obj.className += " " + cls;
}
function removeClass(obj, cls) {
    if (hasClass(obj, cls)) {
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        obj.className = obj.className.replace(reg, '');
    }
}
function toggleClass(obj, cls){
	if (!this.hasClass(obj, cls)){
		addClass(obj, cls);
	}else{
		removeClass(obj, cls);
	}
	console.debug("目标被点击");
}
function getE(query){
	return document.getElementById(query);
}
function onClick(dom,handler){
	if(dom.addEventListener)
		dom.addEventListener("click",handler,false);
	else if(dom.attachHaattachEventdler)
		dom.attachEvent('onclick',handler)
	else
		dom['onclick'] = null;
}
function getChildren(node){
    var child=node.childNodes;
    var result=[];
    for(var i=0;i<child.length;i++){
        if(child[i].nodeType==1){
            result.push(child[i]);
        }
    }
    return result;
}