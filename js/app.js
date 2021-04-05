import { $, $$ } from './shortcuts.js';
import emojis from './emojis.js';

class App {
	#emojisContainer = $('.emojis');
	#ctaButton = $('.btn--cta');
	#emojis = emojis;
	#clipBtns = null;
	#search = $('.search-container__search');

	constructor() {
		this.#renderEmojis();

		this.#ctaButton.addEventListener('click', e => {
			e.preventDefault();
			this.#emojisContainer.scrollIntoView({'behavior': 'smooth'});
		});

		this.#emojisContainer.addEventListener('click', this.#handleCopyToClipboard.bind(this));

		this.#search.addEventListener('input', this.#search4.bind(this));
	}

	#renderEmojis(emojisArr = Object.entries(this.#emojis)) {
		emojisArr.forEach(emoji => {
			this.#emojisContainer.insertAdjacentHTML('beforeend', `
				<div class="emoji emoji--hidden">
					<div class="emoji__header">
						<h2 class="emoji__heading">${emoji[1]}</h2>
					</div>
					<div class="emoji__body">
						<p class="emoji__desc">${this.#formatEmojiDesc(emoji[0])}</p>
					</div>
					<div class="emoji__footer">
						<button class="btn btn--clip">Copy</button>
					</div>
				</div>
			`) ;
		});

		this.#enableFadeInEffect();
		this.#clipBtns = $$('.btn--clip');
	}

	#formatEmojiDesc(desc) {
		return desc
						.split('-')
						.map(word => word[0].toUpperCase() + word.slice(1))
						.join(' ');
	}

	#enableFadeInEffect() {
		const fadeInHandler = function(entries, observer) {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					entry.target.classList.remove('emoji--hidden');
					observer.unobserve(entry.target);
				}
			});
		}

		const fadeInObserver = new IntersectionObserver(fadeInHandler, {
			root: null,
			threshold: .5
		});

		const emojisCollection = this.#emojisContainer.children;
		for (let i = 0; i < emojisCollection.length; i++) {
			fadeInObserver.observe(emojisCollection[i]);
		}
	}

	#copyToClipboard(emoji) {
		const input = document.createElement('input');
		input.type = 'text';
		input.value = emoji;
		document.body.append(input);
		input.select();
		document.execCommand("copy");
		input.remove();
	}

	#handleCopyToClipboard(e) {
		if (e.target.classList.contains('btn--clip')) {
			this.#clipBtns.forEach(btn => btn.textContent = 'Copy');
			const emoji = e.target.parentElement.parentElement.querySelector('.emoji__heading').textContent;
			this.#copyToClipboard(emoji);
			e.target.textContent = 'Copied!';
		}
	}

	#search4(e) {
		const search = e.target.value.toLowerCase();
		const results = Object.entries(this.#emojis)
											.filter(emoji => emoji[0].includes(search));
		[...this.#emojisContainer.children].slice(2)
			.forEach(sib => sib.remove());
		this.#renderEmojis(results);
	}
}

export default App;
