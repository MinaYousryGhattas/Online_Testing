(function($) {
    $.fn.donetyping = function(callback, time=1000){
        var _this = $(this);
        var x_timer;
        _this.keyup(function (){
            clearTimeout(x_timer);
            x_timer = setTimeout(clear_timer);
        });

        function clear_timer(){
            clearTimeout(x_timer);
            callback.call(_this);
        }
    }
})(jQuery);

$(document).ready(()=>{

    $('#search').donetyping(()=>{
        console.log('Search _ajax');
        $.ajax({
            url: '/search',
            type: 'GET',
            dataType: 'json',
            data:{
                search: $('#search').val()
            },
            success: (data)=>{
                $('.exams').remove();
                $(document.body).append('<div class="container panel-group exams"></div>');
                data.forEach(exam=>{
                    $('.exams').append(get_div(exam))
                });
            }
        })
    },100)
});

function get_div(exam){
    var s = '<div class="panel panel-default">' +
        '<div class="panel-heading">'+exam.exam_type.type_name+'</div>' +
        '<div class="panel-body">Candidate: ' +exam.candidate.name+'</div>'+
        '<div class="panel-body">Email: ' +exam.candidate.email+'</div>'+
        '<div class="panel-body">' +
        '<a href="#">Score <span class="badge">'+exam.score+'('+exam.exam_questions.length+') </span></a>' +
        '</div>'+
        '</div>';
    return s;
}
