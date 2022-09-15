import {bs4builder} from '../src/bs4'
import $ from "jquery";

describe('just checking', () => {
  console.log('********* TEST STARTED *****');


  it('works for app', (done) => {
    console.log('App is', bs4builder);

    let htmlElement = __html__['test/index_BS4.html'];
    // let htmlElement = __html__['test/template.html'];
    document.body.innerHTML = htmlElement;

    let obj = new bs4builder({
      key: 'test',
      // the class for which to look to init the notes. At this point ths MUST by input
      convertClass: 'haveNote',
      // Optional - use Google Material Symbols to display icons
      useIcons: true
    });
    obj.buildBS4AddButton();
    document.getElementById('other_code').value = 'Dzak';

    $('document').ready(() => {
      expect($('#other_code').val()).toBe('Dzak');
      done()
    })
  });
});

