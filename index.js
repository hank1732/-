/*
 * 插件功能：联动的下拉列表城市选择
 * @param 参数：DOM 列表的初始显示元素
 * @param 参数：array 列表的联动数据  
 *				array = [array1,array2,array3,array4]; 每一级为一个array
 */
function FilterMenu(){
	/*
	实例属性：
		ul列表
		遮罩
		下拉列表区域
	*/
	this.dom = null;
	this.mask = null;
	this.listDiv = null;
}

// 遮罩相关
FilterMenu.prototype.addMask =function (){
	var mybg = document.createElement("div"); 
	mybg.setAttribute("id","mybg"); 
	mybg.style.background = "#000"; 
	mybg.style.width = "100%"; 
	mybg.style.height = "100%"; 
	mybg.style.position = "absolute"; 
	mybg.style.top = "0"; 
	mybg.style.left = "0"; 
	mybg.style.zIndex = "500"; 
	mybg.style.opacity = "0.6"; 
	mybg.style.filter = "Alpha(opacity=60)"; 	
	mybg.style.visibility  = "hidden";
	document.body.appendChild(mybg);
	document.body.style.overflow = "hidden";
	return mybg; 
}
FilterMenu.prototype.showMask = function (){
	this.mask.style.visibility  = "visible";
}
FilterMenu.prototype.hideMask = function (){
	this.mask.style.visibility  = "hidden";
}
// 选项区域listDiv
FilterMenu.prototype.addListDiv = function (){
	var listDiv = document.createElement("div");
	listDiv.setAttribute("id","itemPanel"); 
	listDiv.style.zIndex = "501"; 	
	listDiv.style.position = "relative"; 
	listDiv.style.background = "#fff";
	this.dom.parentNode.appendChild(listDiv);
	return listDiv;
}
// 显示被点击的Tab
FilterMenu.prototype.showTab = function (dom,level,id,array){
	Base.addClass(dom, "active");
	this.addChildList(this.listDiv,level,id,array);
	this.listDiv.style.visibility  = "visible";
}
// 关闭所有Tab
FilterMenu.prototype.hideAllTabs  = function (dom){
	for(var i=0;i<dom.length;i++){
		Base.removeClass(dom[i],"active");
	}
	if(this.listDiv != null){
		this.listDiv.innerHTML = "";
		this.listDiv.style.visibility  = "hidden";
	}
}
// 添加选项数据
FilterMenu.prototype.addChildList = function (listDiv,level,id,array){
	// var ul = document.createElement("ul");
	/*
	* 判断下一层是否有ul
	* 有，则获取并更新这个ul
	* 没有，就创建一个ul
	*/
	var This = this;
	var ul = null;
	var clearOld = null;
	var clearOldFlag = 0;
	if(Base.getChildren(listDiv)[level] == undefined){
		ul = document.createElement("ul");
	}else{
		ul = Base.getChildren(listDiv)[level];
		ul.innerHTML ="";
		clearOldFlag = level+1;
		clearOld = Base.getChildren(listDiv)[clearOldFlag];
		while(clearOld != undefined){
			this.listDiv.removeChild(clearOld);
			clearOld= Base.getChildren(listDiv)[clearOldFlag];			
		}
	}
	Base.addClass(ul, "item-menu");
	Base.addClass(ul, "item-level"+level);
	var childList = This.findArrayById(array[level],id);
	var fragment = document.createDocumentFragment();
	if(childList != null && childList.items.length != 0){
		for(var i=0;i<childList.items.length;i++){
			(function(_level,_index){
				var li = document.createElement("li");
				li.innerHTML = childList.items[_index].name;
				Base.onClick(li,function(){
					var out = This.addChildList(listDiv,_level + 1,childList.items[_index].id,array);
					console.log(li.innerHTML);
					// 修改url
					This.makeUrl(_level,childList.items[_index].id);
					// 点击最后一级时，关闭列表
					if(out == "end"){
						This.hideAllTabs(Base.getChildren(This.dom));
						This.hideMask();
					}
				})
				fragment.appendChild(li);
			})(level,i);
		}
		ul.appendChild(fragment);	
		listDiv.appendChild(ul);
	}else{
		return "end";
	}	
}

FilterMenu.prototype.findArrayById  = function (array,id){
	if(array == null){
		return null;
	}
	for(var i=0;i<array.length;i++){
		if(array[i].pid == id){
			return array[i];
		}
	}
	return null;
}

FilterMenu.prototype.makeUrl = function (level,id){

	var levelOneText = "aaa";
	var levelTwoText = "bbb";
	var href = window.location.href;
	if(level == 0){
		if(href.indexOf("aaa")>0){
			href = href.replace(new RegExp(levelOneText+"\\d+"),"aaa"+id);
		}else{
			href += levelOneText + id;
		}
		href = href.replace(new RegExp("\/"+levelTwoText+"\\d+"),"");	
	}
	if(level == 1){
		if(href.indexOf("bbb")>0){
			href = href.replace(new RegExp(levelTwoText+"\\d+"),"bbb"+id);
		}else{
			href += "\/"+levelTwoText+id;
		}
	}
	window.history.pushState(null, null, href);
	return href;
}

FilterMenu.prototype.main = function(node,array){
	console.log("联动插件启动");
	var This = this;	
	// 要操作的dom,一个ul列表
	this.dom = Base.getE(node);	
	// 获得列表中的子元素，li元素
	var domChildren = Base.getChildren(this.dom);
	var len = domChildren.length;
	// 初始时，列表层级
	var level = 0;
	// 添加遮罩
	this.mask = this.addMask();
	// 添加该项目区域 listDiv
	this.listDiv = this.addListDiv();		
	// 注册遮罩的事件
	Base.onClick(This.mask,function(){This.hideAllTabs(domChildren);This.hideMask();});
	// 注册Tab的事件
	for(var i=0;i<len;i++){
		(function(index){
			Base.onClick(domChildren[index],
				function(){	
					if (!Base.hasClass(domChildren[index], "active")){						
						// 关闭其他标签
						This.hideAllTabs(domChildren);
						// 显示被点击的Tab
						This.showTab(domChildren[index],level,array[level][index].pid,array);
						// 显示遮罩
						This.showMask();	
					}else{
						This.hideAllTabs(domChildren);
						This.hideMask();
					}					
				}); 			
		})(i);
	}
}

window.onload = function(){
	var fm = new FilterMenu();
	fm.main("filterMenu",array);
};