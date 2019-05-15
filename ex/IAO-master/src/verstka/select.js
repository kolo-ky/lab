export default function tamingSelect() {
  if (!document.getElementById && !document.createTextNode) { return; }

  // Classes for the link and the visible dropdown

  const tsSelectclass = 'turnintodropdown'; // class to identify selects
  const tsListclass = 'turnintoselect'; // class to identify ULs
  const tsBoxclass = 'dropcontainer'; // parent element
  const tsTriggeron = 'activetrigger'; // class for the active trigger link
  const tsTriggeroff = 'trigger'; // class for the inactive trigger link
  const tsDropdownclosed = 'dropdownhidden'; // closed dropdown
  const tsDropdownopen = 'dropdownvisible'; // open dropdown

  /*
    Turn all selects into DOM dropdowns
  */

  let count = 0;
  const toreplace = [];
  const sels = document.getElementsByTagName('select');

  function tsCheck(o, c) {
    return new RegExp(`\\b${c}\\b`).test(o.className);
  }
  function tsSwapclass(o, c1, c2) {
    const cn = o.className;
    o.className = !tsCheck(o, c1) ? cn.replace(c2, c1) : cn.replace(c1, c2);
  }
  function tsAddclass(o, c) {
    if (!tsCheck(o, c)) { o.className += o.className === '' ? c : ` ${c}`; }
  }

  for (let i = 0; i < sels.length; i += 1) {
    if (tsCheck(sels[i], tsSelectclass)) {
      const hiddenfield = document.createElement('input');
      hiddenfield.name = sels[i].name;
      hiddenfield.type = 'hidden';
      hiddenfield.id = sels[i].id;
      hiddenfield.value = sels[i].options[0].value;
      sels[i].parentNode.insertBefore(hiddenfield, sels[i]);
      const trigger = document.createElement('a');
      tsAddclass(trigger, tsTriggeroff);
      trigger.href = '#';
      trigger.onclick = function test2() {
        tsSwapclass(this, tsTriggeroff, tsTriggeron);
        tsSwapclass(this.parentNode.getElementsByTagName('ul')[0], tsDropdownclosed, tsDropdownopen);
        return false;
      };
      trigger.appendChild(document.createTextNode(sels[i].options[0].text));
      sels[i].parentNode.insertBefore(trigger, sels[i]);
      const replaceUL = document.createElement('ul');
      for (let j = 0; j < sels[i].getElementsByTagName('option').length; j += 1) {
        const newli = document.createElement('li');
        const newa = document.createElement('a');
        newli.v = sels[i].getElementsByTagName('option')[j].value;
        newli.elm = hiddenfield;
        newli.istrigger = trigger;
        newa.href = '#';
        newa.appendChild(document.createTextNode(sels[i].getElementsByTagName('option')[j].text));
        newli.onclick = function test3() {
          this.elm.value = this.v;
          tsSwapclass(this.istrigger, tsTriggeron, tsTriggeroff);
          tsSwapclass(this.parentNode, tsDropdownopen, tsDropdownclosed);
          this.istrigger.firstChild.nodeValue = this.firstChild.firstChild.nodeValue;
          return false;
        };
        newli.appendChild(newa);
        replaceUL.appendChild(newli);
      }
      tsAddclass(replaceUL, tsDropdownclosed);
      const div = document.createElement('div');
      div.appendChild(replaceUL);
      tsAddclass(div, tsBoxclass);
      sels[i].parentNode.insertBefore(div, sels[i]);
      toreplace[count] = sels[i];
      count += 1;
    }
  }

  /*
    Turn all ULs with the class defined above into dropdown navigations
  */

  const uls = document.getElementsByTagName('ul');
  for (let i = 0; i < uls.length; i += 1) {
    if (tsCheck(uls[i], tsListclass)) {
      const newform = document.createElement('form');
      const newselect = document.createElement('select');
      for (let j = 0; j < uls[i].getElementsByTagName('a').length; j += 1) {
        const newopt = document.createElement('option');
        newopt.value = uls[i].getElementsByTagName('a')[j].href;
        newopt.appendChild(document.createTextNode(uls[i].getElementsByTagName('a')[j].innerHTML));
        newselect.appendChild(newopt);
      }
      newselect.onchange = function test() {
        window.location = this.options[this.selectedIndex].value;
      };
      newform.appendChild(newselect);
      uls[i].parentNode.insertBefore(newform, uls[i]);
      toreplace[count] = uls[i];
      count += 1;
    }
  }
  for (let i = 0; i < count; i += 1) {
    toreplace[i].parentNode.removeChild(toreplace[i]);
  }
}
