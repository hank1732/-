/*插件功能函数
* @param 参数：DOM
*/
function filterMenu(node,array){
	console.log("插件启动");
	// 要操作的dom
	dom = getE(node);
	var domChildren = getChildren(dom);
	var len = domChildren.length;
	// 添加遮罩
	mask = addMask();
	// 添加该项目区域 listDiv
	var listDiv = addListDiv(dom);
	// 初始时，列表层级
	var level = 0;
	// 注册遮罩的事件
	onClick(mask,function(){hideAllTabs(domChildren,listDiv);hideMask(mask);});
	// 注册Tab的事件
	for(var i=0;i<len;i++){
		(function(index){
			onClick(domChildren[index],
				function(){	
					if (!hasClass(domChildren[index], "active")){						
						// 关闭其他标签
						hideAllTabs(domChildren,listDiv);
						// 显示被点击的Tab
						showTab(domChildren[index],listDiv,level,array[level][index].pid,array);
						// 显示遮罩
						showMask(mask);	
					}else{
						hideAllTabs(domChildren,listDiv);
						hideMask(mask);
					}					
				}); 			
		})(i);
	}
}
// 遮罩相关
function addMask(){
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
function showMask(mask){
	mask.style.visibility  = "visible";
}
function hideMask(mask){
	mask.style.visibility  = "hidden";
}
// 选项区域listDiv
function addListDiv(dom){
	var listDiv = document.createElement("div");
	listDiv.setAttribute("id","itemPanel"); 
	listDiv.style.zIndex = "501"; 	
	listDiv.style.position = "relative"; 
	dom.parentNode.appendChild(listDiv);
	return listDiv;
}
// 显示被点击的Tab
function showTab(dom,listDiv,level,id,array){
	console.log("id  = " + id);
	addClass(dom, "active");
	addChildList(listDiv,level,id,array);
	listDiv.style.visibility  = "visible";
}
// 关闭所有Tab
function hideAllTabs(dom,listDiv){
	for(var i=0;i<dom.length;i++){
		removeClass(dom[i],"active");
	}
	if(listDiv != null){
		listDiv.innerHTML = "";
		listDiv.style.visibility  = "hidden";
	}
}
// 添加选项数据
function addChildList(listDiv,level,id,array){
	// var ul = document.createElement("ul");
	/*
	* 判断下一层是否有ul
	* 有，则获取并更新这个ul
	* 没有，就创建一个ul
	*/
	var ul = null;
	var clearOld = null;
	var clearOldFlag = 0;
	if(getChildren(listDiv)[level] == undefined){
		ul = document.createElement("ul");
	}else{
		ul = getChildren(listDiv)[level];
		ul.innerHTML ="";
		clearOldFlag = level+1;
		clearOld = getChildren(listDiv)[clearOldFlag];
		while(clearOld != undefined){
			listDiv.removeChild(clearOld);
			clearOld= getChildren(listDiv)[clearOldFlag];			
		}
	}
	addClass(ul, "item-menu");
	addClass(ul, "item-level"+level);
	// ul.style.width = 100/(level+1)+"%";
	console.log("loadData  = " + id);
	console.log("level  = " + level);
	var childList = findArrayById(array[level],id);
	var fragment = document.createDocumentFragment();
	if(childList != null && childList.items.length != 0){
		for(var i=0;i<childList.items.length;i++){
			(function(_level,_index){
				var li = document.createElement("li");
				li.innerHTML = childList.items[_index].name;
				onClick(li,function(){
					console.log("loadData  = " + id);
					// var len = getChildren(listDiv).length;
					var out = addChildList(listDiv,_level + 1,childList.items[_index].id,array);
					if(out == "end"){
						console.log(li.innerHTML);
						// alert(li.innerHTML);
						hideAllTabs(getChildren(dom),listDiv);
						hideMask(mask);
					}
				})
				fragment.appendChild(li);
			})(level,i);
		}
		ul.appendChild(fragment);	
		listDiv.appendChild(ul);
	}else{
		// console.log(getChildren(listDiv)[level][index].name);
		return "end";
	}	
}

function findArrayById(array,id){
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

window.onload = function(){
	filterMenu("filterMenu",array);
};