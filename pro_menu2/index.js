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
            var str = document.createElement('input');
            str.type = 'checkbox';
            targetTbodyNode.setAttribute('depth', (depth + 1));
           
           for(var i=0; i<targetCategories.length; i++) {
                var cloneNode = document.importNode(thumbnailCategory.content, true);
                var tds = cloneNode.querySelectorAll("td");
                var trs =  cloneNode.querySelectorAll("tr");
                var categroyNo = targetCategories[i].categoryNo;
                trs[0].setAttribute( 'categroyNo', categroyNo);
                if(depth === 0) {
                    tds[0].append(str.cloneNode()); 
                }
                tds[1].textContent = targetCategories[i].categoryNo;
                tds[2].textContent = targetCategories[i].name;
                targetTbodyNode.appendChild(cloneNode);
            }
            // listSwap(targetTbodyNode);
            addOnclickCategory(targetTbodyNode, (depth + 1));
            allCheck(targetTbodyNode);
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
                console.log(tbodyNode);
                if(e.target.nodeName === 'TD') {
                    var targetCategroyNo = e.target.parentElement.getAttribute('categroyNo');
                    var targetCategory = recursive(categories, parseInt(targetCategroyNo));
                    var targetDepth = e.target.closest('tbody').getAttribute('depth');
                    if(targetCategory.children.length > 0) {
                        insert(targetCategory.children, parseInt(targetDepth));
                    } 
                }
                allCheck(tbodyNode);
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

    function allCheck(targetTbodyNode) { 
        var allCheckbox = document.querySelector(".overall-checkbox");
        allCheckbox.onchange = function() {
            var inputs = targetTbodyNode.parentElement.querySelectorAll("input[type='checkbox']");
            for(var i = 0; i < inputs.length; i++) {
                inputs[i].checked = allCheckbox.checked;
            console.log(inputs.length);
            listSwap(targetTbodyNode);
            }
        };
    }
    
    function listSwap(targetTbodyNode) {
        var swapButton = document.querySelector(".swap-button");
        swapButton.onclick = function() {
            var inputs = targetTbodyNode.querySelectorAll("input[type='checkbox']:checked");
            // console.log(inputs.length);
            if(inputs.length != 2) {
                alert("엘리먼트는 2개만 선택해야만 합니다.");
                return;
            }
            var trs = [];
            for(var i = 0; i < inputs.length; i++) {
                trs.push(inputs[i].parentElement.parentElement);
            }
            var cloneNode = trs[0].cloneNode(true);
            trs[1].replaceWith(cloneNode);
            trs[0].replaceWith(trs[1]);
        };
    }
    xhr.send();
});




