{% include js/masonry.pkgd.min.js %}

$('.products_container').masonry({
  //columnWidth: 200,
  itemSelector: '.grid_item',
  horizontalOrder: true,
  //fitWidth: true
});


function order_sum(element){
  var amount = $(element).val();
  var price = $(element).data('price');
  var result = amount * price;
  var str_result = result.toFixed(2);
  $(element).closest('.order_element').find('.order_price .output').text('€ ' + str_result);
}

$(".input_amount input").each(function() {
  $(this).keyup(function(){
    var element = $(this);
		order_sum(element);
	});
})
