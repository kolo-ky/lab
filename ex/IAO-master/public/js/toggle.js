$(function () {
	toggleFadeMenu();
});
function toggleFadeMenu() {
	$('.js-user-menu').each(function () {
		var parent = $(this);
		var list = parent.find('.js-fade-menu');
		list.fadeOut();
		parent.find('.js-fade-menu-toggle').click(function (event) {
			event.stopPropagation();
			parent.toggleClass('active');
			list.fadeToggle();
		});
		$(document).click(function () {
			parent.removeClass('active');
			list.fadeOut();
		});
	});
}
