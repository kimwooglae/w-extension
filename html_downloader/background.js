function injectedFunction() {
  alert(document.body.innerHTML);
  console.log(document.body.innerHTML);
}

chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: function () {
      var html = new XMLSerializer().serializeToString(document);
      var w2xPath = getParameter("w2xPath");
      var filename = w2xPath
        ? (location.host + location.pathname + w2xPath).replace(/\//g, "_") +
          ".html"
        : (location.host + location.pathname).replace(/\//g, "_") + ".html";
      const file = new File([html], filename, {
        type: "text/html",
      });

      const link = document.createElement("a");
      const url = URL.createObjectURL(file);

      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      function getParameter(param) {
        try {
          var url = location.search;
          var _idx = url.indexOf("?");
          if (_idx >= 0) {
            var srch = url.substring(_idx + 1);
            var arrayOfSrch = srch.split("&");
            for (var i = 0; i < arrayOfSrch.length; i++) {
              var tmpArray = arrayOfSrch[i].split("=");
              if (tmpArray.length == 2 && tmpArray[0] == param) {
                if (tmpArray[1] == "") {
                  return "";
                } else {
                  return tmpArray[1];
                }
              }
            }
          }
        } catch (e) {}
        return "";
      }
    },
  });
});
