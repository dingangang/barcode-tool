
function genID() {
    var index = 1
    return function () {
        return index++
    }
}

var gen = genID()

function renderBarcode(target, data,type,width,height) {
    for (var i = 0; i < data.length; i++) {
        var index = gen()
        target.append(
            '<img id="barcode' + index +'"/>'
        )
        $('#barcode' + index).JsBarcode(data[i], {
            format: type,
            width: width || 2,
            height:height || 40,
        });
    }
}

$(function () {
    $('#barcode-height').val(40)
    $('#barcode-width').val(2)
    $('#page-height').val(1024)
    $('#submit').on('click', function () {
        var input = $('#input-barcode').val()
        if (input === '') {
            alert('请输入条码，以英文逗号（,）隔开')
            return
        }

        var reg = /(([^,]+),)+/
        if (!reg.test(input)) {
            alert('输入的条码必须以英文逗号（,）隔开')
            return
        }
        var inputArr = input.replace(/[\r\n]/g, "").split(',')

        var barcodeHeight = parseInt($('#barcode-height').val()) + 42 || 82
        var pageHeight = parseInt($('#page-height').val()) || 600
        var barcodePerPage = Math.floor(pageHeight / barcodeHeight)
        var pageIndex = 0
        var renderArr = []
        debugger
        while (pageIndex < inputArr.length) {
            renderArr.push(inputArr.slice(pageIndex, pageIndex + barcodePerPage))
            pageIndex += barcodePerPage
        }

        for(var i = 0; i < renderArr.length; i++) {
            var pageId = gen()
            $('.barcode-container').append(
                '<div class="page" style="height:'+ pageHeight +'px" id="barcode' + pageId +'"/>'
            )
            renderBarcode(
                $('#barcode' + pageId),
                renderArr[i],
                $('#barcode-type').val(),
                $('#barcode-width').val(),
                $('#barcode-height').val()
            )

        }

    })
    $('#trigger').on('click', function () {
        var panel = $('.panel')
        var page = $('.page')
        if (panel.is(':visible')) {
            panel.hide()
            page.addClass('.page--no-border')
        } else {
            panel.show()
            page.removeClass('.page--no-border')
        }
    })
    $('#reset').on('click', function () {
        $('.barcode-container').empty()
    })
})
