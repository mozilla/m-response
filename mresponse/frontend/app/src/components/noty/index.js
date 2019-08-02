import Noty from 'noty'
import './noty.scss'

export const noty = (props) => {
  const config = {
    type: 'info',
    theme: 'moz',
    layout: 'bottomCenter',
    timeout: 400,
    callbacks: {
      onTemplate () {
        let resultIcon = ''

        switch (this.options.icon) {
          case 'copy':
            resultIcon = `
              <svg xmlns="http://www.w3.org/2000/svg" xmlns-xlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
            `
            break
          default:
            break
        }

        this.barDom.innerHTML = /* html */`
          <div class="noty_body_wrap">
            <div className='noty-icon'>
              ${resultIcon}
            </div>
            <span class="noty_body">${this.options.text}</span>
          <div>
        `
      }
    }
  }
  const newNoty = new Noty({ ...config, ...props })
  newNoty.show()
}
