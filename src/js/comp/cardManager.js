/* eslint-disable no-console */
// eslint-disable-next-line import/no-cycle
import Upload from './upload';

export default class CardManager {
  constructor(element) {
    if (typeof element === 'string') {
      // eslint-disable-next-line no-param-reassign
      element = document.querySelector(element);
    }

    this.element = element;
    this.onStorage = this.onStorage.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.onCard = this.onCard.bind(this);
    this.change = undefined;
    this.onMove = this.onMove.bind(this);
  }

  onClick(e) {
    //  e.preventDefault();

    // this.el = el;

    const li = document.createElement('li');
    li.className = 'item';
    li.innerHTML = `<textarea class = 'textarea' 
             placeholder = ...></textarea>
             <div class = 'block'> <button class = 'button'> Add card</button> <span class = 'span'>х</span>
             </div>
            `;
    // this.el = e.target.closest(`.${this.el.className}`);

    // el.insertBefore(li, e.target);

    // el.appendChild(li);

    // this.element.insertBefore(li, e.target);
    this.element.querySelector('.items').appendChild(li);
    e.target.classList.add('add2');
    this.element.querySelector('.span').addEventListener('click', () => {
      e.target.classList.remove('add2');
      // this.el.classList.add('add');
      li.remove();
      // this.el.style.display = 'block';
    });
    this.element.querySelector('.button').addEventListener('click', this.onCard);
  }

  // перезаписываем иннер хтмл
  // eslint-disable-next-line class-methods-use-this
  onStorage() {
    localStorage.setItem(
      'value',
      JSON.stringify(document.querySelector('.file-container').innerHTML),

    );
  }

  onCard(e) {
    // e.preventDefault();

    // this.el = e.target.closest(`.${this.el.className}`);

    if (!e.target || this.element.querySelector('.textarea').value === '') {
      // const time = setTimeout(() => {
      //    console.log(this.el.querySelector('.textarea').value);
      //           }, 100);
      this.element.querySelector('.block').classList.add('done');
      this.element.querySelector('.textarea').addEventListener('click', () => {
        this.element.querySelector('.block').classList.toggle('done');
      });
      return;
    }
    const div = document.createElement('li');
    div.className = 'item_card item_remove';
    // div.innerHTML = `<div class = 'card'
    //          >${this.element.querySelector('.textarea').value}</div>
    //          `;
    div.innerHTML = `<div class = 'card' 
               >${this.element.querySelector('.textarea').value}</div>             
               `;
    // div.style.left = `${0}px`;
    // div.style.top = `${0}px`;
    this.element.querySelector('.items').appendChild(div);
    this.element.querySelector('.add').classList.remove('add2');
    // // e.target.closest('.block').remove();
    this.element.querySelector('.item').remove();
    const removes = Array.from(this.element.querySelectorAll('.item_remove'));
    removes.forEach((el) => {
      el.addEventListener('click', () => {
        if (e.target === el) {
          console.log(el);

          // щелкала и событие было див кард,
          //  а ближе к крестику  - получается событие стало ли. и сработал ремув.
          el.remove();
          // e.target.remove();
          this.onStorage();
        }
        console.log(e.target);

        // this.onStorage();
      });
    });
    //       this.element.forEach((el)=>{
    // el.appendChild()
    //       })
    console.log(this.element);
    this.onStorage();
    this.onMove();
  }

  onRemove(e) {
    e.target.closest('.item_remove').remove();
    e.target.remove();
    this.onStorage();
  }

  onMove() {
    this.element.querySelectorAll('.item_card').forEach((el) => {
      // попробовать айьемс и ретурн потом
      const cl = new Upload('.file-container');
      //  cl.cardManager.element = this.element;
      el.addEventListener('mousedown', cl.onStartDrag);
      this.onStorage();
      //! !!!!!!!!
      // console.log(cl.cardManager.element);
    });
  }
}
