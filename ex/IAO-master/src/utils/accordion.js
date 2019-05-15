export function toggleAccordion() {
  $('.js-accordion').each(function () {
    const items = $(this).find('.js-accordion-item');
    const itemsNotActive = items.not('.active');
    items.find('a.active').click(() => false);
    const contents = itemsNotActive.find('.js-accordion-item-content');
    contents.slideUp();
    if (!$(this).hasClass('init')) {
      $(this)
        .find('.js-accordion-item-link')
        .click(function () {
          const parent = $(this)
            .parents('.js-accordion-item');
          const parentSiblings = parent.siblings('.js-accordion-item');
          parentSiblings.find('.js-accordion-item-content')
            .slideUp();
          parentSiblings.removeClass('active');
          parent.find('.js-accordion-item-content')
            .slideToggle();
          parent.toggleClass('active');
        });
    }
    $(this).addClass('init');
  });
}

export function toggleAccordion2() {
  $('.js-accordion-2').each(function () {
    const items = $(this).find('.js-accordion-item-2');
    const itemsNotActive = items.not('.active');
    items.find('a.active').click(() => false);
    const contents = itemsNotActive.find('.js-accordion-item-content-2');
    contents.slideUp();
    if (!$(this).hasClass('init')) {
      $(this)
        .find('.js-accordion-item-link-2')
        .click(function () {
          const parent = $(this)
            .parents('.js-accordion-item-2');
          const parentSiblings = parent.siblings('.js-accordion-item-2');
          parentSiblings.find('.js-accordion-item-content-2')
            .slideUp();
          parentSiblings.removeClass('active');
          parent.find('.js-accordion-item-content-2')
            .slideToggle();
          parent.toggleClass('active');
        });
    }
    $(this).addClass('init');
  });
}
