function url(year, resultType) {
    return `https://bitest.ciat.cgiar.org/bi/result-dashboard_test?year=${year}&resultType=${resultType}`
}

let widget = null;

var pbiwidget = {
    init: (divId, year, resultType, height = '1000px') => {
        widget = document.getElementById(divId);

        let iframe = document.createElement('iframe');
        iframe.setAttribute('id', 'iframe-dashboardEmbed');
        iframe.setAttribute('scrolling', 'no');
        iframe.setAttribute('src', url(year, resultType));
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        // widget.style.background = 'red'
        widget.style.width = "100%";
        widget.style.height = height;
        widget.appendChild(iframe);
        // iframe.onload = function () {
        //     console.log("Iframe loaded");
        // }


    },

    setFilters(year, resultType) {
        let iframe = document.getElementById('iframe-dashboardEmbed')
        iframe.setAttribute('src', url(year, resultType));
    }

}