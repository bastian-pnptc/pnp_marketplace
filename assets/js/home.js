---
---
$(document).ready(function () {
    $('body').addClass('deactivated');
    $('#warning-message button').click( function() {
        $('body').removeClass('deactivated');
    })
});

{%- include js/shave.min.js -%}
{%- include js/order.js -%}
{%- include js/cardgrid.js -%}
{%- include js/jquery.timeago.js -%}
