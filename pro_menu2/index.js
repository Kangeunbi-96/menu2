window.addEventListener("load", function(){
    let xhr = new XMLHttpRequest;
    var body = document.querySelector('body');

    xhr.open('GET', 'http://220.85.155.13:5187/categories', true);
    let categories = {};
    xhr.onload = function() {

        if(this.status === 200) {
            JSON.parse(this.responseText);
        }
        categories = (JSON.parse(this.responseText) || {}).categoryResponses || {};
        
        function initCategoryBodyBox(depth) {
            let arrNumber = [];
            for (let i = 0; i < 3; i++){
                arrNumber[i] = i + 1;
            }
            const itemToFind = arrNumber.find(function(item) {
                return item === parseInt(depth);
            });
            const idx = arrNumber.indexOf(itemToFind);
            if (idx > -1) arrNumber.splice(idx, 1);
            arrNumber.forEach(arrayIndex => {
                if(depth < parseInt(arrayIndex)) {
                    let targetTbodyNode = body.querySelector("#sec" + (arrayIndex) + " tbody");
                    if(targetTbodyNode.rows.length > 0) {
                        targetTbodyNode.querySelector('tr').remove();
                    }
                }
            })
        }
        function insert(targetCategories, depth) {
            initCategoryBodyBox(depth);
            var targetTbodyNode = body.querySelector("#sec" + (depth + 1) + " tbody");
            targetTbodyNode.setAttribute('depth', (depth + 1));
           for(var i=0; i<targetCategories.length; i++) {
                var cloneNode = document.importNode(thumbnailCategory.content, true);
                var tds = cloneNode.querySelectorAll("td");
                var trs =  cloneNode.querySelectorAll("tr");
                var categroyNo = targetCategories[i].categoryNo;
                trs[0].setAttribute( 'categroyNo', categroyNo);
                tds[0].textContent = targetCategories[i].categoryNo;
                tds[1].textContent = targetCategories[i].name;
               targetTbodyNode.appendChild(cloneNode);
            }
            addOnclickCategory(targetTbodyNode, (depth + 1));
        }
        insert(categories, 0);
        function recursive(category, categoryNo) {
            let k = 0;
            let len = category.length;
            for (; k < len ; k++ ) {
                let targetCategory = category[k];
                if(targetCategory.categoryNo === categoryNo) return targetCategory;
                else if(targetCategory['children']) {
                    let result =  recursive(targetCategory['children'], categoryNo);
                    if (result !== false) {
                        return result;
                    }
                }
            }
            return false;
        }
        function addOnclickCategory(tbodyNode, depth) {
            tbodyNode.onclick = function(e) {
                if(e.target.nodeName === 'TD') {
                    var targetCategroyNo = e.target.parentElement.getAttribute('categroyNo');
                    var targetCategory = recursive(categories, parseInt(targetCategroyNo));
                    var targetDepth = e.target.closest('tbody').getAttribute('depth');
                    if(targetCategory.children.length > 0) {
                        insert(targetCategory.children, parseInt(targetDepth));
                    } 
                }
                bgChange(e.target.parentElement, tbodyNode);
            }
        }
    };

    function bgChange(td, tbodyNode) {
        for(var i = 0; i < tbodyNode.children.length; i++) {
            tbodyNode.children[i].style.backgroundColor = '#fff';
        }
        td.style.backgroundColor = 'gold';
    }

    xhr.send();
});