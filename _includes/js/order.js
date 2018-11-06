{%- include js/slick.min.js -%}

$('#order_window .order_steps').on('init', function(){
  setTitle(0);
}).slick({
  draggable: false,
  infinite: false,
  swipe: false,
  touchMove: false,
  nextArrow: document.getElementById('btn_next'),
  prevArrow: document.getElementById('btn_prev'),
  appendDots: document.getElementById('order_title'),
  dots: true,
  adaptiveHeight: true
});

function setTitle(currentSlide) {
  var slide_title = $('.order_steps .step_' + (currentSlide + 1)).data('title');
  $('#order_title h2').text(slide_title);
}

function grabValues(currentSlide, nextSlide) {
  if ( currentSlide < nextSlide && nextSlide == '2' ) {
    setValues(nextSlide);
  }
}

function setValues(nextSlide) {
  var order_firstname = $('#order_window #input_firstname').val();
  var order_lastname = $('#order_window #input_lastname').val();
  var order_email = $('#order_window #input_email').val();
  var order_location = $("#order_window #input_location option:selected").text();
  $('#js_firstname').text(order_firstname);
  $('#js_lastname').text(order_lastname);
  $('#js_email').text(order_email);
  $('#js_location').text(order_location);
}

$('#order_window .order_steps').on('beforeChange', function(event, slick, currentSlide, nextSlide){
  setTitle(nextSlide);
  grabValues(currentSlide, nextSlide);
  if ( currentSlide == 1 && nextSlide == 2 && !( $('#submit_btn').hasClass('active') ) ) {
    $('#submit_btn').addClass('active')
    $('#btn_next').addClass('deactivated')
  } else {
    $('#submit_btn').removeClass('active')
    $('#btn_next').removeClass('deactivated')
  }
});

$('#order_window .order_steps').on('afterChange', function(){
  calc_height();
});


// triggered on order click
$('.js_order').click(function(){
  var button = $(this);
  var product = button.parents('.product_item');
  var amount = product.find('.input_amount input').val();
  var stock = product.data('product_stock');
  if (amount > 0 && stock >= amount) {
    order_init(product);
  } else if ( stock < amount ) {
    message(product, 'ERROR: It seems like you are trying to order more products than are currently available.')
  } else {
    message(product, 'ERROR: Please enter an amount > 1 for the product you would like to order')
  }
})

$('#btn_cancel').click(function(){
  close_order();
})

function order_init(product) {
  var product_details = get_product_info(product);
  set_order_info(product_details);
  open_order();
}

function message(product, message) {
  var el = product.find('.error_message');
  var el_p = el.children('p')
  $(el_p).text(message);
  var offset_el  = $(el).offset().top;
  $('html, body').animate({
    scrollTop: offset_el
  }, 400);
  if ( !el.hasClass('active') ) {
    $(el).addClass('active');
  }
}

$('.error_message').click( function(){
  if ( $(this).hasClass('active') ) {
    $(this).removeClass('active');
  }
})

function calc_height() {
  var order_height = $('#order_window').outerHeight(true);
  $('.order_window__container').css({
    'height': order_height,
  });
}

function open_order() {
  $('#order_window .order_steps').slick('slickGoTo', 0);
  $('html, body').animate({
    scrollTop: 0
  }, 400);
  calc_height();
  $('body').addClass('deactivated');
}

function close_order() {
  $('body').removeClass('deactivated');
  $('.order_window__container').css({
    'height': '0',
  })
}

function decode_info( input ){
  var temp_decode = decodeURIComponent( input );
  var regex = /(\+\+)(?=\w)(?!\s)/g;
  var temp_decode = temp_decode.replace(regex, ' • ');
  var regex = /\+(?=\w)(?!\s)/g;
  var output = temp_decode.replace(regex, ' ');
  return output;
}

function get_product_info(product) {
  var title = product.data('product_title');
  var price = product.data('product_price');
  var id = product.data('product_id');
  var description = product.data('product_description');
  var image = product.data('product_image');
  var stock = product.data('product_stock');
  var categorie = product.data('product_categorie');
  var amount = product.find('.input_amount input').val();
  var result = product.find('.result .output').text();
  var product_details = [];
  product_details.push(title, price, id, description, image, amount, result, stock, categorie);
  return(product_details);
}

function set_order_info(product_details) {
  var product_title = decode_info(product_details[0]);
  $('#order__product-name').text( product_title );
  $('#form_product_title').val( product_title );

  var product_price = decode_info(product_details[1])
  $('#order__product-price').text( product_price );
  $('#form_product_price').val( product_price );

  var product_id = product_details[2];
  $('#form_product_id').val( product_id );

  var product_desc = decode_info(product_details[3]);
  $('#order__product-desc').text( product_desc ).shave(150);
  $('#form_product_desc').val( product_desc );

  $('#order__product-img').css('background-image', 'url(' + product_details[4]) +')';

  var product_amount = product_details[5];
  $('#order__product-amount').text(product_amount + ' x');
  $('#form_product_amount').val( product_amount );

  var product_result = product_details[6];
  $('#order__product-result').text( product_result );
  $('#form_product_result').val( product_result );

  var product_stock = product_details[7];
  $('#form_product_stock_ondemand').val( product_stock );

  var product_categorie = product_details[8];
  $('#form_product_categorie').val( product_categorie );
}
