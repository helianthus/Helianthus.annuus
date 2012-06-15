(function()
{

var location = window.location;
var history = window.history;

if(!/(?:demoforum|groupon|forum\d+)\.hkgolden\.com$/i.test(location.hostname)) return;

if(document.body && document.body.firstChild.className == 'webkit-line-gutter-backdrop' || /\.(?:gif|jpe?g|png|asmx)$/i.test(location.href)) return;

document.domain = 'hkgolden.com';

document.addEventListener && (function()
{
	var keywords = /bmediaasia|pixel-?hk|imrworldwide|googlesyndication|_getTracker|(?:Page|Inline|Google|\b)[Aa]ds?\b|scorecardresearch|addthis/;

	(window.opera || document).addEventListener(window.opera ? 'BeforeScript' : 'beforeload', function(event)
	{
		if(keywords.test(event.url || event.element.src || event.element.text)) {
			event.preventDefault();
		}
	}, true);
})();

var
AN = window.AN = { mod: {}, version: '${AN_VERSION}' },
jQuery, $, $d, $w,
$r = {
'balloon--minus': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACCElEQVR42s3SX0hTURwH8ONvRGGAZEhYRRIBBRTgWxDQnoKgxwhiWVFJOAwiBKSctsyXgJUUumCQMO9EIwhyQK4XQ0DmljZaBq5s1233zq5Lubv70/LX7yfzwkx76aUDH87hnN/3dy+cI8R/NUZbocZ/E6zkKmkj7WVt5T0r12waft0KR8fu1LfPjXX5jcWQvJqPF7CYRCwmcDX/rWCoQXnujcPPNVxbEX5lh32BzkNOXZmMY+4rov6ZzG5Ae7kY6ol38YCjwckZs8HLFriofJDCmKWilcjf6Z9QCXnCnDEbjNwAR2k5msVMGNeVtHHUlSHU5Meozndj6svdNbzW4u4sZ8wGvma49zMzY+DSFJa+j+NywoPp+QdU7NyUEusxOGM28F6D6/Lks0hRC+CPhSe4JLu2lFl4hLNvmyOcMRsMXIGDL27v71Wjfams6kU96dlScvp+avhWXS9nKm7i+Wlo9NprXUGfbWIx+lQ1UkPFQnoEC+lhzBOeg4PnJ7z2XS7PJWg0g5IQbp8QU2tATEvbRUyqFomBhqqPfTZwr/ul+ZHnfhvsrvhyPwVzTU24Ee/z+ZljAC2nLCcenrNI7I8X2E1/0EXFnUKESJju5n2HEDOXhRik48OEX91x6xG40HHWMsprcoBUm01OClFFk4VsIzvITsJvvpbUkT2knuwtr2vKtf8+fgN0RI2UbTRH1wAAAABJRU5ErkJggg==',
'balloon--plus': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACHklEQVR42mNgGFRgay4T/7Y8JkcgTgbiUiCuhOJSqJgjSA1WzVtymTR3V0tW3tndsO3b67OP//149PP/r2f///96+v/fj4c/v708/fjOrrptIDUgtSiaN2YzSe+pV2r68uLko//f7////+UmEN9Aw0Cx73f/f3l6+NGeOoUmkB64AeuymGJfXFp27v9XoKJPl/HjL9f/vzg79xxID9yA1RlMdX8+Xvv6//25/zD85+2h/19erPj/9vHE/y8ftPx/fq8GjEHst49mfgXpgRuwPI2p8ff7i9/+vzvz/8+bQ/8/Pp37/9WDVqDiJqz4xd22byA9cAOWpDClPj456/Kvt3v+f3gy5f+7x/048fsnE/7f2Jt2GaQHbsDCRCZ5q8lCl7U36f5KOuTz/8uzuTjxswvNz1cVik4C6UGJCY6FwtdS3pX+V1qm+OX1takvvz1f8evnq9X/f75a9f8HEIPo00vDjy7JFuyfG89khNA5R2gmw1yhMyAc+jrtP/cMwbuC0wSemrbxXJ0ewzQThv++3fYfRM+IYRJGTUFTBc44Pg/6j45B4iBpL10mpiwHZsvuUOZlIIyZBHv5ZjL08J1h6OY7q/PI9j9DF995hk6+iwwZ3EuBsipADEp1eo4aTFG1vsxbQWwglgViLoQhruyMDE08Z6Xua/8H0ueAItxADErzQkAsCsTiQCwJxFJQNkiOFdUluWwzGTJZz4BpEgAAGMWWFPVe+3EAAAAASUVORK5CYII=',
'chain--arrow': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABhUlEQVR42mNgGAVgEBwcbBwSEhIPxOlIOB4kjk8OrNnHx8c0PT299tixY7fv3r379/Hjx/8fPHjw98SJE3cdHR2rQRibHEgPSC+Dq6tr6qFDB+80NNQfFRIS6mdhYenq6Oj4P3PmTBQMEgPJgdSA1IL0gPQyWFlZFV2+fPmHvLxcA8hFIEVAyf/Xrl39/+rVq/+vX7/+f+vWrf9AV4ANAKkBqQXpAell0NfXz9u0acf9urrmbQICAkXMzMzV5eXl/7FhkBxIDUgtSA9ILwMvL6+TlpbOtDlzlj4+cuTinytXHv8/efL6n3nzlj8GiaPLVW95/r920ZGPIHGQXpCLhIAmhwOd1wRyIhJuAopHgzCynGHz0RdGLceeyQdWTQPpBRnACcRiQCyFDSslz1qp23L2IjKe/vT/fxCtED8lhWAaUa48fGbS4///s67+/x97EYGLb/z/D5IjaIBkzvaZEllbzyBji6P//4NooFwMyamWN2b5GRDmi1sZQ1ayZwucMxOI4ZoBsGkPUwBKpQ4AAAAASUVORK5CYII=',
//'control-stop-090': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABBUlEQVR42mNgGB7Aft7LmUB8hgQ8E8UA6xmPz0x58P9//+1/GLjvFiqeePf/f5B6FAPMJt6ZaTrh9hliMUg9QW/ptl2M0Wu/dAZEkxwmqjXHY9RqT5zpuPLrP4gG8YnWLFu4J0auaO+Z+tOf/wfOvfm/YM+L/yA+SJygZtH0TTFiGZvPZO19/d966mU4jlz/6D9IHCSPUzNf7IoY/riVZ7z3f/kvtfQNBjba9OE/SB6kDkMzR8j8GM7QBWcMD/37L7rj33/h7f/+C277958fiHm3/vvPveXff64tEHGQOpB6ZP3MzNbF85n9Zp4hGgPVg/TBDQBifiCWBGIpIrAkVD3z4MhHABdQ8Tt3BG1pAAAAAElFTkSuQmCC',
'control-270': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA/0lEQVR42mNgGAVgYDv7mbH93BdnSMEgPXADrKY/ErWYcn9d5t4Pzybd+/e/69ofFNx5FYL7bv39n7br/TOQWpAeFFcY990U1Wu/tC5564tn9ae//09e/+p/5NIH//1nX/vvOfXi/4Q1d/8HL73/DKQGpBarVzQbTosqVx5eF7z0zrPYTY//W0+9DMZBK+//d5117RlIDqQGb3jIFu4Rlcjaus58+rVnZls+/jfY+OG/7qQrz0BiIDmiApXTKFyUN2b5Osney88kei4/A7FBYsToFQBiLVCQMAkqOLD6TNkMwiA2SAyI9YBYBIgZcRnAAcQgm6RwYHEg5sJnwEgEAFrDorvTBfJaAAAAAElFTkSuQmCC',
'control-eject': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABNElEQVR42mNgGLTAft7LGCA+A6JJ1mw943GM9cwnZ2Y+/f8fRIP4RGs2m3gnxmzS3TPTH///X338x/+pD//9B/FB4gQ163deiTHounpm8v1//3N3foLjvlt//oPEQfI4NWs0nI7RbDxzpv/2n/9pm979T1z78n/44vv/fWde/e8x5cL/8sOv/4PkQeowNCuWHYxRKj90pufG7/9lhz7/z9r+4n/c6rv/Y1be/h+1/Nb/iKU3/4cvufE/c/uT/yB1IPUoBsjk75opnbfzDLEYpJ66cc4TtXQmb/SyM8RikHoUAzhC5p/ROPD/v+Tu///Fd/3/L7Lz/3+hHf//CwAx3/b//3m2/f/PDcScWyFskHpk/czM1sXzmf1mniEaA9WD9MENAGJ+IJYEYikisCRUPfPgyHQAtfPpcW73XZQAAAAASUVORK5CYII=',
'control-stop-270': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABHklEQVR42mNgGB7Aft7LmUB8hgQ8E8UAm5lPYqxnPD4z8+n//703/6LgnhsIPO3R//8gdSD1GK4wm3gnxnTC7TPTH///n7/7MwaecOfPf5A8SB1Or+h3XI7Ra790ZuLdP/9jVz79Hzj35n/v6Zf/N5z58B8kDpInGB7qdSdj1GpPnKk7/eG/88Sz/8uPvPkP4oPEiQ5U+ZJ9MXJFe89kHHz7H0SD+CTHjFj6phixjM1nQDRBxXyxK2byx608QywGqUcxgDN0wZmos///+5/4/9/j+P//jkf+/7c8/P+/wYH//zX2/f8vv+f/f/Gd//8L7Pj/n3/7//8g9cj6mZmti+cz+808QzQGqgfpgxsAxPxALAnEUkRgSah65sGRjwBY+PLdCjYKSQAAAABJRU5ErkJggg==',
'cross-shield': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACN0lEQVR4XpWNTUgTYBjH/+ZAp4vhvgyIQYoIbEkwT0MQcTBAsckM1ZPoRc8VXoIIKKCgS1RRtFBWm19BWlNMKIIyQJaTNtJ9YIPmmDHVy0TEp+eBl1gwgf7wg+d9nv+PF6dlCmhkPiga8T95BRiCwHyqo+O3IDPvzKcKL7nA3PUDFxg7z9PrLS2/9kdHaW9khL63tm7z7o3cpCNdcaCCCWAl09t7EKys/Dap1a7FXK7czvAwbXR30w+Ph7KDgxRtb98J8i3AnWRX14E4UIEP+MzCSXpggH7295Nk1eX6B0mip4fiXi9t9fWdiAMVPAOWk17v8Senk4oj71K7Nbf7WByo4DEwE+vsPFxubqapujqSFAoFymazlEqlKB6PUzKZpKc1NeQzm2nBbj8UByp4ADxabWvbf+9w0GJTE70wGikcDlMkEqFYLEaJRIJ8LI8rZq3WPXYeQgX3geshmy2zZLfTtMlEk1wqltPptOwEmuG732DIsHMNKrgHuPnXzY/19TRfQs5kMpTL5eRGCxYLPdFqN8WBCm4D+jtlZStfGhqOiuVZFgSR8/m8QEsm05F0xUFxbgE3x/X6rbf8g8hzLH5VyCyy7J5XVGxJF5JibgDGq8BiQK/fDhmNtG4wUIQFBb1j/FVV29KRLkrlMmAdAibGNJronE63u8GSIPNYeXlUbtIp5Z5hdIylFjh/CRi6AoQC1dU5QWbZyQ1ArXSV8zcadbAxDuEs4OTfXnsYmWWnuMicUw7+AKvQcvS+6EM5AAAAAElFTkSuQmCC',
'film--arrow': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACXElEQVR4Xo2STUhUURiGn3PPvTNO6kypSCoZ+UsGuJKWum4Vg4KgEyESERQBbYJwVVCbyEgIEyJkQtAkIDBoYxDQxqCVOmRFEiBQMY7ze+89X1MzY2mAPfDC4fKcl++7HCUiWJZ1EWgr5b/4WM5DmxJti4uLXdFo1L8/9y7qGwEUIgCCEUGMoBRci/Utll0AKgVW8cMHoB0lZAsuIIiAACKlczq587drAViVgoWFhU5AizEoJVCMiMF3XbLpDOurX1hb2wTQZdfaM8Hg4OAnoCObckml8/iej7IMkYhFzmRxjYegKu6/E8zPz58AtC8KJ+gQbqimuamW47Wa7sYQzc1hqsM1ALrs7p1gaGhoE+g8FKlCez4ikMzkMVqwHY22A7S21+26+wv03Nxcy/DwsH724PIqwNbWlp9IJPLsQyn1y20tul8BKu9gmhJdE9Pv+32jSKY9fF+oICIY4zN9/fRrIEGJC7srxOPxxpGREV0VCpIrGIJVijJ7SrrHJrsHB3ojt84NrOxZoXj5G9CAaApZH21Z2IFSv/ENnuviFVyCTSdrX2zgHO0/nxI79Kdgdna2LhaL2fmUKRYIruvheVkSCjKWxnYsLGWTS+9w9drZ+smdnR7nSMto5R88pUTPxNRGbybn4nk+Tkiz/D3J6Fgfa9uQ8tilMQjPn7xZscu7Vc/MzDjj4+O1giZUU0w4gNaKw9tJHk8to5WAgs8bq/mOK5eCS3ceJZ26Y/d+T6CUugucAno5gOozt+uxnYy7/nIpEG4ctilxAwgDFgfg2pGbkv3x1l1/FS8APwH/5BEQGBT1zwAAAABJRU5ErkJggg==',
'highlighter--minus': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA3ElEQVR42u3PsQsBYRgG8Oe+O5JLCIlSRzEopfgj/AsWNrv1JoP9yuRWw91gwWBgVZZvvf9CVuN5Pihdphvlrd/y9j7v+31AjDocUEXcOh4x2O8hNxu4scOXC8IgwNX3MYkd9jzI1Qq9f/i3woZh9C3L2n4Le4DrAzJK9R9hXdeb5DqOE3LJOXp5yeHbaBRGqf57wSMshNhpmja1bZifr5vz0ozDUaqP0+n551d4DKBMJSpQnrKUoTSlKAnAUHdJw3oNuVhANhoYAuhSh9rUojrVqEJFypH5WpQgcQcJm8GojKRW7AAAAABJRU5ErkJggg==',
'highlighter--plus': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABDElEQVR42mNgIAPs2sUgxUAu2L2bwWPbNoYzGzYwzCRb85s3DP+vXmV4t3w5QxrZmpctYzizaBGD8ahmumteKToTiM+AabJsXiJyJuVd6X8QjaGZhYXFREFBYSNWzXOEZjLMFToDwqGv0/7D2GBxEGBmZlYF4pn9/f3/gYYcx7B5qsAZx+dB/9ExSBxmAFgzExPTJkZGxsKqKgZuFOf18s1k6OE7A8I6j2z/w9hg8SNHIH6Gao4HKhcHYlEgFgZiQSDmB2JeIOZiaOI5J3Vf+z+QPguyF4gZGVavZjgzaRLDGSUlhkiggAEQ6wKxFhCrAbEiEMsCsSQQizD4sy5gyGA9xxDIOhfIZwViJgCDltVoETWpngAAAABJRU5ErkJggg==',
'image-export': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB6ElEQVR42sWTMWgTYRSAv7tc7kys2A7WxFJURAUL2sEGDS4S6SCESEHcnIOT4FIsbcEOEYmLULAohSoB0UFotkIGQTuok4NQ0VBUUpqisTGX5P673POa0cnQwQ++8X08HjxNRNgNOrtEuzo7mwYO0RsVESkCMDE1lZUe2ZkJZEfD8zzdF+FCrk1IB9MAX6DTgf0R6LOEqAlnD0PU/cAevU671TICcZXqBjRPhMRRjb2WdIc8H0LQDSoPdA1OxuDr502uZTLcX1qKiMhY07bfGa7r6p7v8+vnQ2LDZzg+eA4djf6oUPvdpGnXELXF+qcfKNWmUq3ytlC4N5LJ3BYRnYvZ7M1tpeTUjbScn7wu+eUVWV2ry6uPDXn/pSlrFUeq2544ri9/cySVmtGVUt0NKt/rrJerPC4ucuvRJPPFeQql5zwrvWRx+QUPnj7h7sIC3zY2AIglk3PBHUq66zjdQLzvCoPRDAPhy+wLXQIZo8Vp2pEExFJERyZwHIfheJz+0dGc02qtiMgbQykV6ohgWZFACzMwZIQR0Wg7QqPhIuKi3DAd8wBT+TwHh4bsIPDaCIfRjo2PT68Wi3eCEP+CaZok0+kZYA7A2CyXqycSiRw90LHtLb/ZBEADLGCgh7/wgRrgAPz/b/wDyPozmVUBpGMAAAAASUVORK5CYII=',
//'layout-join-vertical': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAgVBMVEUAAAAAAAAAAAAAAACAgICAgIB5eXl8fHx0dHRra2twcHAvSasjRa8kRqsqTL4wUrU1V9I/YeVCZMhWeNxkhuzh4eHj4+Pm5ubn5+fp6enq6urr6+vs7Ozt7e3v7+/x8fHz8/P09PT19fX4+Pj5+fn6+vr7+/v8/Pz9/f3+/v7///9U8zd6AAAADHRSTlMAChcaTWZnZ2hpacOKeUSnAAAAbElEQVQYGU3BMQ7CMBBE0dFPUgWl4A7c/2IUCYUlYnYHuVq/x7rNVrG8Zouws9iCnCHIKImwVWyxn1c5d+HjUQ4Lx6+ERTiCbSDCIdKZvAcyncJh38/htsMC270N3TYClgKit29pXbTrU66mP9kmlUjFKf9PAAAAAElFTkSuQmCC',
//'layout-split-vertical': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAilBMVEUAAAAAAAAAAAAAAACAgICAgIB5eXl8fHx0dHRra2twcHAvSavp6en4+Pj6+vowUrU1V9JCZMhWeNzm5uYjRa/q6uokRqvw8PAqTL7z8/P09PT19fX39/fv7+/x8fH+/v75+fn7+/vt7e329vY/YeVkhuzs7Ozj4+Pn5+fr6+v8/Pzh4eH9/f3///8fOEWCAAAADHRSTlMAChcaTWZnZ2hpacOKeUSnAAAAhklEQVR4XlXGxwLCIADA0FRrl0D33u75/78nnKjvkuAetlzwv1s+ePPHmj0IXqv1CiBS0lIRhIu0lhCu/yDrW21YB5M+g3S6aef0bDKlEI9CjJ2KVWcmhuqU521ltHl+qqAo7/dykoWczBTQiLdWN7WJaCB5PrRxGE2eCRwvW0dwdntr5/ADyxAXxxuhm0oAAAAASUVORK5CYII=',
'magnifier-zoom-in': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACNklEQVR42mNgwAOSWl5ppLS9mQvE94H4F5SeCxJnIAQiqu4HRtc+vN+04OmJrSff7rrz/MuJo1c+Hehd/vIUSBwkj1OzR9Z5DZ+8i/enbXy448iN14defvxx69O3389ff/p5+9Gbb2fnb3+yyxcoD1KH1QCrmANz83svnth96cWBq48/ngBpBor9B9FP3n47d+3JpxMlEy6dAqnDaoCO36b7c7fd3X7m3rsLd19+efDuy68PQLH/IBrEB4kv3XN/D0gdVgNU3Fb/2nn++QGQYiD7Pzr++O33s8PXXh8DqcNqgJLL2vsLtt/bDbIJpPjn77+fgWL/QTQ4LD7+vLVq38NDIHVYDVD33DE3u+382f1XXx2+//LraZAmoBg8DIABea64++IlkDqsBpg7ZVoZBR9+MW/zg7M3n30+DQp9WCw8e//94ob9r04Zh5y8rxdwDDMWrK2t5W1sbIo7Ju/5bxV54VXjjOeXTl75cvr5ux/XT139cqZj7strNnG37ptHXsdMB0CNWm5u7jU7duz5Lyoq1qxm1WLnmPx8LhDfB+JfUHqufeITTJttbW0tAgOD244cOfNfUVGph4WFRZWBWGBnZ+edkJAy4eLFu//19AymATUbM5ACzM3NS27devXf3t55HlCzCwOJgENUVNRFRESkBag5G8jXByVGIAb5UwWI5YFYGojFgFgQiHlAeoCYFYiZQAawQCWlgFgSiCWgfBEgFgJiASDmA2JuIOYEYjaoHmYgZgQAJMBTRbnQscgAAAAASUVORK5CYII=',
'magnifier-zoom-out': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACE0lEQVR42mNgwAOSWl5ppLS9mQvE94H4F5SeCxJnIAQiqu4HRtc+vN+04OmJrSff7rrz/MuJo1c+Hehd/vIUSBwkj1OzR9Z5DZ+8i/enbXy448iN14cevfl29snbb+dAGMSev/3JLl+gPEgdVgOsYg7Mze+9eGL3pRcHrj7+eAKmGYavPfl0omTCpVMgdVgN0PHbdH/utrvbz9x7d+Huyy8P0DFIfOme+3tA6rAaoOK2+tfO888PgBQD2f/R8cdvv58dvvb6GEgdVgOUXNbeX7D93m6QTSDFn779fo6MX3/8eWvVvoeHQOqwGqDuuWNudtv5s/uvvjp8/+XX0+hhAAzIc8XdFy+B1GE1wNwp08oo+PCLeZsfnL357DOKAc/ef7+4Yf+rU8YhJ+/rBRzDjAVra2t5Gxub4o7Je/5bRV541Tjj+aWTV76cfv7ux/VTV7+c6Zj78ppN3K375pHXMdMBUKOWm5t7zY4de/6Lioo1q1m12DkmP58LxPeB+BeUnmuf+ATTZltbW4vAwOC2I0fO/FdUVOphYWFRZSAW2NnZeSckpEy4ePHufz09g2lAzcYMpABzc/OSW7de/be3d54H1OzCQCLgEBUVdREREWkBas4G8vVBiRGIQf5UAWJ5IJYGYjEgFgRiHpAeIGYFYiaQASxQSSkglgRiCShfBIiFgFgAiPmAmBuIOYGYDaqHGYgZAVI8VtW3Z2FZAAAAAElFTkSuQmCC',
'picture--minus': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAByElEQVR42sWTP2tTURiHn3vum5ubc//l1sSSxBoaQYcKUTpVEAo6CLq4Ojn4PfwUUh0KXQXp5OjiYAfBDgoKJQgFRRclbbRp7j0n1+FmCIqCdfDdzg/eh+dwfgf+9zgP1nkErJ5w/5XYKau3tt6fCPD0bg8xFpRS3HnSRTlQcUFcyAwUBcQ1iH0QBb0GrLTATGGtsY+xINaC67r0z4AnkNSgEcDnQ6hVynMBDI/gYhv6HTjKwJ26WAuSWxAR2sELzreWSYM2RQEXFmExKkHjDHqnSpOJKaEyEXILYkwJeLa7yY6vuXH5Nusr1xBVGvUaMM5hQUNuy0xXwFrBmDmDvcEe9aTO49EWB6OPLDXP0lpY4nScUvN8cHS57JVXO85mBvnMYHLQ4cs34ftXj+3hG2r+gEAHhEFIGIZEYUQSxSw12yw3O1ztCLkByWaAXus6nudRrVbRWhNFIUkSkaYxaRqRJAFx7BMEFVRVIXJMZuYM5qcoCoyxjMcZSo1pP7yPv/+OXCkOHQfHUTzXBd1PdGU4Kp/x5ca93xZme2PAzSuXfsnfvt7VzprHZurQ/1Pjzhm6ukD/nH+AHQfwgDogf9lkAwz/+Tf+AI0siBbqAfEPAAAAAElFTkSuQmCC',
'smiley-twist': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACXUlEQVR42oWScUhTYRTFLyUBawBBiQZIRoJoQbDI1IjI/opYBRuQBIVgkECMWP9FUATKAixwxDOczLKNoHBCWG5vYhnmWjI0020sYxCpW+sxwdrYdvvOV8YmQh8cDvec37084BGJ5yJSHhMZ3ppJt/KUjEKKkE8o8NcxG9GDA0/Fz0EUHKmqCnvqKJjyHwpnvtzW8klnltPPC3DMyNGDA19yoFsEq5fOZn++t2icVJhXhBJO5uSjP45Z5OjBdRcfiPWRrqdWHBi7oK3NX+Vg/1FOTVu58M0u9EA6ZuTowYHHnjwQ6SXj1+HaSOHzFdamTBx+1sLerr38faqdg45m6ZiRowcHHnvywJydlNVpk5YPneZlXwvnchk2XFbk0rowI0cPDjz25IHQPfJlZs9nF57U89JIE8eHjnDc08RLL4/xD/8J6ZiRowcHHnvyQMBGgdyMudDXUcaD1/TsuVnBo53VJV+AGTl6cOCxJw9M3CHf2uSprNuq448fVI7FYuz1ejd19ODAY08e8N0gZflFozZuq+CZV52cz+c5Go1u6ujBgceePDBkIeNEV3kkMdzAnlt7OP5J5VAoxOl0usSRowcHHnvywGA76QbayL3gOJBYdB/m0bv1POa6zovz7/j1uF86ZuTowYHH3r+fqbeVavovlqlzDw2JlPcczzqb+c39/aza9knHjBw9OPC08VmOU43dTG6PtTIcc53UNH9r9tdkWwGOGTl6cBt3twqVC9Xt1FOj6SB12M7QQI+JVLEQgGNGLvoGwVUL6YsPbBHaLrRLaPd/VCm0Q2jb+vJvBcwQQD7QC78AAAAASUVORK5CYII=',
'tick-shield': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACW0lEQVR42pWSb0hTYRSH3+lgptvkbrvTNol1p66YRjWSGlFFluWMiTSpkiihgvpYEUAQAQUUBBBVUI5a+5fOoA1mVFEIpmW2KY5y1Fob7YILKj8NEU/nva5uqwl04OGee855fsDlErJY9bIm5HkeE/mv8mpUxK8JbZns+EqhPc7YxQUPHng0l4hbsxxpwL7P8mrHl/2pE7Dv83FoGt3J4+yhsKM39JY6v8ulHrZNdc3IfLpImV8ftY61TTs+HoWWyF6BPR+OgPVNWxb3UZlXF9k24ZihjhjgVA11fjo23/7+MNjfHRKkTS/tBVgHbbB9rBNaJw7A7tjBeeqIAbeYp7bJrrn1L3ZBMVaFNwOt20m38L71dcccdcSAG0yg+a0jZ3nSDObQRqBPKtUG1oHunhlSqRSk02ngeR5YZz2sCG7IUUcMuFp53Tpk+0HlXC4HNf5GULmMwDg5SCQSQkAmkxHembsc6HsbvqNzTQy4ojxtCjZlvPEAxGIxyGazwHj+kl0o3+dA01eHvSGDzikx4LKyhekxxA0Da4SAeDxeKPtQDi3Ahuuh7KY2Th0x4IK8UnJRMcwNrp1V9RsL5X4Un4moH9fOErylTuHPdL7inOKOPlk9uhKYILcg45MZEVGNGEHWwybp7b9/49lyNTkpe6T06nh2vA5UA/gRxzmRKAflbi1Pb4TbomWXLiPdpS7pmSUxeXDpN2YKRYT2pTijO+GmSJUgckRLqiQ1ZLWkmzgk4QofO02hvTCjO0Kq8rclfwZI8wszYhFQECuxkwekHaH9rzkhjUh13iE/AQ4sY0V2q+EfAAAAAElFTkSuQmCC',

'gnome-mime-image-bmp': 'data:image/png;base64,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'
},
$s = [
	{
		desc: '聖誕表情圖示',
		html: {
			path: 'faces/xmas',
			table: [
				[
					['[O:-)x]', 'angel'],
					['[xx(x]', 'dead'],
					['[:)x]', 'smile'],
					['[:o)x]', 'clown'],
					['[:o)jx]', 'clown_jesus'],
					['[:-(x]', 'frown'],
					['[:~(x]', 'cry'],
					['[;-)x]', 'wink'],
					['[:-[x]', 'angry'],
					['[:-]x]', 'devil'],
					['[:Dx]', 'biggrin'],
					['[:Ox]', 'oh'],
					['[:Px]', 'tongue'],
					['[^3^x]', 'kiss'],
					['[?_?x]', 'wonder'],
					['#yupx#', 'agree'],
					['#ngx#', 'donno'],
					['#hehex#', 'hehe'],
					['#lovex#', 'love'],
					['#ohx#', 'surprise']
				],
				[
					['#assx#', 'ass'],
					['[sosadx]', 'sosad'],
					['#goodx#', 'good'],
					['#hohox#', 'hoho'],
					['#killx#', 'kill'],
					['#byex#', 'bye'],
					['[Z_Zx]', 'z'],
					['[@_@x]', '@'],
					['#adorex#', 'adore'],
					['#adore2x#', 'adore2'],
					['[???x]', 'wonder2'],
					['[bangheadx]', 'banghead'],
					['[bouncerx]', 'bouncer']
				],
				[
					['[censoredx]', 'censored'],
					['[flowerfacex]', 'flowerface'],
					['[shockingx]', 'shocking'],
					['[photox]', 'photo'],
					['[yipesx]', 'yipes'],
					['[yipes2x]', 'yipes2'],
					['[yipes3x]', 'yipes3'],
					['[yipes4x]', 'yipes4'],
					['[369x]', '369'],
					['[bombx]', 'bomb'],
					['[slickx]', 'slick'],
					['[fuckx]', 'diu'],
					['#nox#', 'no'],
					['#kill2x#', 'kill2']
				],
				[
					['#kill3x#', 'kill3'],
					['#cnx#', 'chicken'],
					['#cn2x#', 'chicken2'],
					['[bouncyx]', 'bouncy'],
					['[bouncy2x]', 'bouncy2'],
					['#firex#', 'fire']
				]
			],
			span: [
				['[offtopicx]', 'offtopic']
			]
		}
	},
	{
		desc: '綠帽表情圖示',
		html: {
			path: 'faces/xmas/green',
			table: [
				[
					['[:)gx]', 'smile'],
					['[:o)gx]', 'clown'],
					['[:-(gx]', 'frown'],
					['[:~(gx]', 'cry'],
					['#yupgx#', 'agree']
				],
				[
					['[sosadgx]', 'sosad'],
					['#goodgx#', 'good'],
					['#byegx#', 'bye']
				],
				[
					['[369gx]', '369'],
					['[fuckgx]', 'diu']
				]
			]
		}
	},
	{
		desc: '新年表情圖示',
		html: {
			path: 'faces/newyear',
			table: [
				[
					['[:o)n]', 'clown'],
					['[:o)2n]', 'clown2'],
					['[:o)3n]', 'clown3'],
					['#assn#', 'ass'],
					['[sosadn]', 'sosad'],
					['[sosad2n]', 'sosad2'],
					['[sosad3n]', 'sosad3'],
					['[bangheadn]', 'banghead'],
					['[banghead2n]', 'banghead2']
				],
				[
					['[yipesn]', 'yipes'],
					['[369n]', '369'],
					['[3692n]', '3692'],
					['[fuckn]', 'diu'],
					['[bouncern]', 'bouncer']
				]
			],
			span: [
				['[offtopicn]', 'offtopic'],
				['[offtopic2n]', 'offtopic2']
			]
		}
	},
	{
		desc: '腦魔表情圖示',
		html: {
			path: 'faces/lomore',
			table: [
				[
					['[:-[lm]', 'angry'],
					['[:Dlm]', 'biggrin'],
					['[:Olm]', 'oh'],
					['[:Plm]', 'tongue'],
					['#lovelm#', 'love'],
					['#goodlm#', 'good'],
					['#hoholm#', 'hoho'],
					['#killlm#', 'kill'],
					['[???lm]', 'wonder2'],
					['[flowerfacelm]', 'flowerface'],
					['[shockinglm]', 'shocking'],
					['[yipeslm]', 'yipes'],
					['[offtopiclm]', 'offtopic']
				],
				[
					['[369lm]', '369'],
					['[@_@lm]', '@'],
					['#hehelm#', 'hehe'],
					['[fucklm]', 'diu'],
					['[bouncerlm]', 'bouncer'],
					['[sosadlm]', 'sosad']
				]
			]
		}
	},
	{
		desc: 'SARS表情圖示',
		html: {
			path: 'faces/sick',
			table: [
				[
					['[O:-)sk]', 'angel'],
					['[:o)sk]', 'clown'],
					['[:-[sk]', 'angry'],
					['[:-]sk]', 'devil'],
					['#yupsk#', 'agree'],
					['#ngsk#', 'donno'],
					['#cnsk#', 'chicken']
				],
				[
					['#asssk#', 'ass'],
					['[sosadsk]', 'sosad'],
					['#hohosk#', 'hoho'],
					['#hoho2sk#', 'hoho2'],
					['#killsk#', 'kill'],
					['#byesk#', 'bye'],
					['[@_@sk]', '@'],
					['#adoresk# ', 'adore'],
					['[bangheadsk]', 'banghead']
				],
				[
					['[flowerfacesk]', 'flowerface'],
					['[shockingsk]', 'shocking'],
					['[photosk]', 'photo'],
					['#firesk#', 'fire'],
					['[369sk]', '369'],
					['[fucksk]', 'diu']
				]
			]
		}
	},
	{
		desc: '特殊圖示',
		html: {
			path: 'faces',
			table: [
				[
					['#good2#', 'ThumbUp'],
					['#bad#', 'ThumbDown'],
					['[img]/faces/surprise2.gif[/img]', 'surprise2'],
					['[img]/faces/beer.gif[/img]', 'beer']
				]
			]
		}
	}
];