/**
 * enter实现tab功能
 * @param {Object} obj
 * @param {Object} e
 */
function autoJumpNextFormElement(obj) {
	var self = $(obj),
		form = self.parents('div[role="form"]:eq(0)'),
		focusable, next;
	//if(e.keyCode == 13) {
		focusable = form.find('input,select,button').filter(':visible');
		next = focusable.eq(focusable.index(obj) + 1);
		if(next.length) {
			next.focus();
		} else {
			// form.submit();
		}
		//	return false;
	//}
}