;
(function() {
	let dropdown = document.querySelector('.dropdown'),
		toggler = dropdown.previousElementSibling;
		
	toggler.addEventListener('click', () => {
		if (dropdown.style.maxHeight) dropdown.style.maxHeight = null;
		dropdown.classList.toggle('is-active');
		dropdown.style.maxHeight = dropdown.scrollHeight + 'px';
	});
})();