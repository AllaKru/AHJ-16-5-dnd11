/* eslint-disable no-console */
// eslint-disable-next-line import/no-cycle
import CardManager from './cardManager';

export default class Upload {
  constructor(element, cardManager) {
    if (typeof element === 'string') {
      // eslint-disable-next-line no-param-reassign
      element = document.querySelector(element);
    }

    this.element = element;

    if (localStorage.getItem('value')) {
      this.element.innerHTML = JSON.parse(localStorage.getItem('value'));
    }
    // а после идет привязывание innerHTML так как
    // В innerHTML нет слушателей событий. Вам нужно пройти
    // по кнопкам/элементам и подсоединить обработчики.

    this.activeDragElement = undefined;
    this.gost = undefined;
    this.element1 = undefined;

    this.onClick = this.onClick.bind(this);
    this.onStartDrag = this.onStartDrag.bind(this);
    this.onEndDrag = this.onEndDrag.bind(this);
    this.onDrag = this.onDrag.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.oncardManager = this.oncardManager.bind(this);

    this.cardManager = cardManager;
    this.arr = this.element.querySelectorAll('.add');

    this.element.addEventListener('click', this.onClick);
    // this.element.addEventListener('click', this.oncardManager);
    this.element.addEventListener('click', this.onRemove);
    // this.element.addEventListener('mousedown', this.onStartDrag);
    // Array.from(this.element.querySelectorAll('.item_remove')).forEach((el) => {
    //   el.addEventListener('click', this.onRemove);
    // });
    this.element.querySelectorAll('.item_card').forEach((el) => {
      el.addEventListener('mousedown', this.onStartDrag);
    });
  }

  oncardManager(e) {
    this.element.querySelectorAll('.container').forEach((el) => {
      if (el === e.target.closest('.container')) {
        this.cardManager = new CardManager(e.target.closest('.container'));
      }
    });
  }

  onClick(e) {
    e.preventDefault();
    this.oncardManager(e);

    this.arr.forEach((element) => {
      if (e.target === element) {
        this.cardManager.onClick(e);
      }
    });
  }

  onStartDrag(e) {
    e.preventDefault();
    this.oncardManager(e);

    Array.from(this.element.querySelectorAll('.item_card')).forEach((el) => {
      if (el.querySelector('.card') === e.target) {
        const { target } = e;
        this.activeDragElement = target;
        this.activeDragElement.closest('.item_card').classList.add('dragged');

        this.gost = document.createElement('li');
        this.gost.className = 'gost';
        this.gost.style.display = 'none';

        document.documentElement.addEventListener('mouseup', this.onEndDrag);
        document.documentElement.addEventListener('mousemove', this.onDrag);

        this.onDrag(e);
      }
    });
  }

  onEndDrag(e) {
    try {
      if (this.activeDragElement) {
        // const element = document.elementFromPoint(e.clientX, e.clientY);
        // eslint-disable-next-line no-console
        console.log(e);

        this.activeDragElement.closest('.item_card').classList.remove('dragged');

        this.element.querySelectorAll('.container').forEach((el) => {
          console.log(this.element1);

          this.element1.closest(`.${el.className}`).querySelector('.items').insertBefore(this.activeDragElement.closest('.item_card'), this.element1.closest('.item_card'));
          this.element.querySelectorAll('.gost').forEach((el2) => {
            el2.remove();
          });
        });

        this.gost = undefined;

        this.activeDragElement = undefined;
      } else {
        console.log('oshibka');
      }
      // document.documentElement.addEventListener('mouseup', this.onEndDrag);
      // document.documentElement.addEventListener('mousemove', this.onDrag);
    // eslint-disable-next-line no-shadow
    } catch (e) {
      console.log(e);
    }

    document.documentElement.removeEventListener('mouseup', this.onEndDrag);
    document.documentElement.removeEventListener('mousemove', this.onDrag);
    this.cardManager.onStorage();
  }

  onDrag(e) {
    e.preventDefault();
    this.element1 = document.elementFromPoint(e.clientX, e.clientY);
    if (!this.activeDragElement || this.element1 === this.element) {
      return;
    }

    this.gost.style.display = 'block';
    this.gost.style.top = `${e.clientY - 20 + window.scrollY}px`;
    this.gost.style.left = `${e.clientX - 20 + window.scrollX}px`;

    this.element.querySelectorAll('.container').forEach((el) => {
      // if (this.element1.closest(`.${el.className}`) === null) {
      //   console.log(this.element1);
      // }

      if (el === this.element1) {
        el.querySelector('.items').appendChild(this.gost);
      } else {
        this.element1.closest(`.${el.className}`).querySelector('.items').insertBefore(this.gost, this.element1.closest('.item_card'));
        // console.log(this.element1);
      }
    });

    this.activeDragElement.closest('.item_card').style.top = `${e.clientY - 40 + window.scrollY}px`;
    this.activeDragElement.closest('.item_card').style.left = `${e.clientX - 40 + window.scrollX}px`;
  }

  onRemove(e) {
    e.preventDefault();

    // variant 1
    // if (e.target.closest('.item_remove').offsetWidth - e.offsetX <= 23) {
    //   console.log(e.target.closest('.item_remove').offsetWidth, e.offsetX);
    //   this.cardManager.onRemove(e);
    // }
    // variant 2
    Array.from(this.element.querySelectorAll('.item_remove')).forEach((el) => {
      if (el === e.target) {
        console.log('remove');
        // el.style.cursor = 'context-menu';
        this.cardManager.onRemove(e);
      }
    });
  }
}
