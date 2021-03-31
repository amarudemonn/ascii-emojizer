document.addEventListener('DOMContentLoaded', function(e) {
	const emojisContainer = document.querySelector('.emojis');

	const ctaButton = document.querySelector('.btn--cta');

	ctaButton.addEventListener('click', function(e) {
		e.preventDefault();
		emojisContainer.scrollIntoView({'behavior': 'smooth'});
	});

	function formatEmojiDesc(desc) {
		return desc
						.split('-')
						.map(word => word[0].toUpperCase() + word.slice(1))
						.join(' ');
	}

	Object.entries(emojis).forEach(emoji => {
		emojisContainer.insertAdjacentHTML('beforeend', `
			<div class="emoji">
				<div class="emoji__header">
					<h2 class="emoji__heading">${emoji[1]}</h2>
				</div>
				<div class="emoji__body">
					<p class="emoji__desc">${formatEmojiDesc(emoji[0])}</p>
				</div>
				<div class="emoji__footer">
					<button class="btn btn--clip">Copy</button>
				</div>
			</div>
		`) ;
	});

	const clipBtns = document.querySelectorAll('.btn--clip');

	function copyToClipboard(emoji) {
		/*
			Not sure
			But looks like
			document.execCommand("copy");
			works only with inputs and areas
		*/
		const input = document.createElement('input');
		input.type = 'text';
		input.value = emoji;
		document.body.append(input);
		input.select();
		document.execCommand("copy");
		input.remove();
	}
	
	emojisContainer.addEventListener('click', function(e) {
		if (e.target.classList.contains('btn--clip')) {
			clipBtns.forEach(btn => btn.textContent = 'Copy');
			const emoji = e.target.parentElement.parentElement.querySelector('.emoji__heading').textContent;
			copyToClipboard(emoji);
			e.target.textContent = 'Copied!';
		}
	});
});
