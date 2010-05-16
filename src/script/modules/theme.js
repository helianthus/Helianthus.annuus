annuus.addModules(function(){ return {

'8d20a0be-25e2-48e4-a4c1-9ec8fa809cab':
{
	title: '樣式設定',
	pages: { comp: [all] },
	options: {
		borderColorContent: { title: '內容邊框顏色', type: 'text', defaultValue: 'cccccc' },
		bgColorContent: { title: '內容背景顏色', type: 'text', defaultValue: 'ffffff' },
		fcContent: { title: '內容字體顏色', type: 'text', defaultValue: '000000' },
		borderColorHeader: { title: '標頭邊框顏色', type: 'text', defaultValue: '6ea0c4' },
		bgColorHeader: { title: '標頭背景顏色', type: 'text', defaultValue: '6ea0c4' },
		fcHeader: { title: '標頭字體顏色', type: 'text', defaultValue: 'ffffff' },
		borderColorDefault: { title: '可點擊物件: 預設邊框顏色', type: 'text', defaultValue: 'ccddea' },
		bgColorDefault: { title: '可點擊物件: 預設背景顏色', type: 'text', defaultValue: 'ccddea' },
		fcDefault: { title: '可點擊物件: 預設字體顏色', type: 'text', defaultValue: '1a3448' },
		borderColorHover: { title: '可點擊物件: 懸浮邊框顏色', type: 'text', defaultValue: 'ccddea' },
		bgColorHover: { title: '可點擊物件: 懸浮背景顏色', type: 'text', defaultValue: 'ccddea' },
		fcHover: { title: '可點擊物件: 懸浮字體顏色', type: 'text', defaultValue: '33aaaa' },
		borderColorActive: { title: '可點擊物件: 作用邊框顏色', type: 'text', defaultValue: 'ccddea' },
		bgColorActive: { title: '可點擊物件: 作用背景顏色', type: 'text', defaultValue: 'ccddea' },
		fcActive: { title: '可點擊物件: 作用字體顏色', type: 'text', defaultValue: '33aaaa' },
		borderColorHighlight: { title: '高亮邊框顏色', type: 'text', defaultValue: 'ffffff' },
		bgColorHighlight: { title: '高亮背景顏色', type: 'text', defaultValue: 'eeeeee' },
		fcHighlight: { title: '高亮字體顏色', type: 'text', defaultValue: '444444' },
		bgColorOverlay: { title: '塗層顏色', type: 'text', defaultValue: 'eeeeee' },
		bgColorShadow: { title: '陰影顏色', type: 'text', defaultValue: 'aaaaaa' }
	},
	tasks: {
		'd15b72b1': {
			type: 'utility',
			js: function(job)
			{
				/*.ui-state-error, .ui-widget-content .ui-state-error, .ui-widget-header .ui-state-error { border-color: #{0[borderColorError]}; background: #{0[bgColorError]}; color: #{0[fcError]}; }
				.ui-state-error a, .ui-widget-content .ui-state-error a, .ui-widget-header .ui-state-error a,
				.ui-state-error-text, .ui-widget-content .ui-state-error-text, .ui-widget-header .ui-state-error-text { color: #{0[fcError]}; }*/

				$.theme = function(options) {
					$.rules('\
						.ui-widget-content { border-color: #{0[borderColorContent]}; background: #{0[bgColorContent]}; color: #{0[fcContent]}; } \
						.ui-widget-content a { color: #{0[fcContent]}; } \
						.ui-widget-header { border-color: #{0[borderColorHeader]}; background: #{0[bgColorHeader]}; color: #{0[fcHeader]}; } \
						.ui-widget-header a { color: #{0[fcHeader]}; } \
						\
						.ui-state-default, .ui-widget-content .ui-state-default, .ui-widget-header .ui-state-default { border-color: #{0[borderColorDefault]}; background: #{0[bgColorDefault]}; } \
						.ui-state-default a, .ui-state-default a:link, .ui-state-default a:visited { color: #{0[fcDefault]}; } \
						.ui-state-hover, .ui-widget-content .ui-state-hover, .ui-widget-header .ui-state-hover, .ui-state-focus, .ui-widget-content .ui-state-focus, .ui-widget-header .ui-state-focus { border-color: #{0[borderColorHover]}; background: #{0[bgColorHover]}; color: #{0[fcHover]}; } \
						.ui-state-hover a, .ui-state-hover a:hover { color: #{0[fcHover]}; } \
						.ui-state-active, .ui-widget-content .ui-state-active, .ui-widget-header .ui-state-active { border-color: #{0[borderColorActive]}; background: #{0[bgColorActive]}; color: #{0[fcActive]}; } \
						.ui-state-active a, .ui-state-active a:link, .ui-state-active a:visited { color: #{0[fcActive]}; } \
						\
						.ui-state-highlight, .ui-widget-content .ui-state-highlight, .ui-widget-header .ui-state-highlight  { border-color: #{0[borderColorHighlight]}; background: #{0[bgColorHighlight]}; color: #{0[fcHighlight]}; } \
						.ui-state-highlight a, .ui-widget-content .ui-state-highlight a,.ui-widget-header .ui-state-highlight a { color: #{0[fcHighlight]}; } \
						\
						.ui-icon, \
						.ui-widget-content .ui-icon, \
						.ui-widget-header .ui-icon, \
						.ui-state-default .ui-icon, \
						.ui-state-hover .ui-icon, .ui-state-focus .ui-icon, \
						.ui-state-active .ui-icon, \
						.ui-state-highlight .ui-icon, \
						.ui-state-error .ui-icon, .ui-state-error-text .ui-icon \
							{ background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAADwCAMAAADYSUr5AAAC4lBMVEUCAABdcL3L4fSzAwN2vumyu8qe1vGdAABMldujqcjb4+eFyfEefcKzQCgjRa+Jy+t3wOlCpdfr1YLp0480V407h80qjc/Vx33ShEqjxORvuuiO3vukqqsCAQEbAACXmp10y+xHZWPkf1uCfYvlaV/CZzR2BwGSocpapdg4m9W/hx6CyfAwMTS2gSZXr90kJCCOzfKgAAA6m9piruNpjZIuTaJDZ9+DyvGocwKm4fqe5Py1wb4vWr8rks9xteYNQqiz5fq95PZfCAN7AAAAAAB6we0IPaTYTURVnNRwtejl1J1NgJbUr0jw9vgCkxh+yO/WxVtos93kpT0/Y9w4YNyVCQGLJQKnVgFHU1Q0WdFotONcpusIO5zh5u2Awu8ikMxogYOEyfFRqd0rUcZEodpmye1RY3Gt0+p6uOIAPBm/JyhMpNk9mtoBG1q2AAEwbsdKWFhapt+6zLtbZGRDTFMkaaiU1/Vzveqj1vSDeY44aNBIatUkRrN2a5xOv/Q3ldZpiYvYymtcipkljzhoTTUCBAs0m9M1ZMwUEQowmdKzWwXAGiAsOjpoYEECGlWWAACst7IAAABuvOhikeW3DRC0fAi/ExjfVFK8ig0sGhnav0pUbs2RlJeCUga3Bgdea2mzdSsoSrqwTRG8LCdLWFxRW18tMS5fq+E8ftYzLzEDAQFbjLw5Q0Rmd3cFAQFlpuV5weyCl9piseMSR68DKCnJyK04PUKeaQRTX192kNFOWFy3hhkma7hmnt80fkcCDQUDCxcsJCa2eQQSkyeDyfHhV1lXpt1iPwyLhJU9RUcrKix2AQAzltMCAACjDwC6bQIaULkkickAAACZy+trSh63RRpNfMA3NjlTBgR4LAphX0RTAABzvechhcdCUVW82e4yeNF/xe2tJQE9LhlOcotbZEMJAQAACAFBDAdgpd5sbqs2ERACKknMWj0GPHwGAQHV2uLJ5/b8/f339fHs7/Tk7fCyWCI9AAAA8HRSTlMA+NLIyf7gR5b+/snK8f3nM8z8/f02yvz6/hb9y5yTuu37+8r8yxP+NV+RaICkxU7IwMtfbvzmXTv8/dKZoJmx+PwQZSnJnusRyfpn6fvSfvQ49fX1FBI6SuvK+rH+yst8VV7zXPEf15Eo68qZNLQ+h8rdlXhX/VvF3YX07+j4ZXfzae8IhMqNAMjE7ksLRbLRGR/734fk9nmd7PLGSM2ErvbT7zkmR8hwkgM6SowGy1n8FZ4p6HlDhv0thEeR9ytpnprllvmTS8N6kLObGUapobAA+g3lE32rEAV0Kb1DyHmHQU4aA50lEBDwqDDcqwJ6AMInAAAbNUlEQVR4XuyZsWvjyhbGpxBTrApJhYqVGnUrYzAiLoIEMeNCYBeLcStYLw4ReWA3bhxXdhdI6/tH5MEtNnF34b5OqNomCFJludfFK1zKyfZv7I00Z+RNlosd4n07P9J8Oed45hxLxXeM9gCBQHDoHKK9YrZAxgLoaON+hoqeZPGd2GHEZaCFAeSZlEpnXDI78lXQj6vlLryhLBeus+hGMM5jtMob/csylOpVV2VTOr4knnd5DJPZka/yCE56snzaBXH+G6KokcwaiJwVERtADWcTAF8xkHdSNIpaueyfr+jDZHDky7P5CDb+LXtcDwGpBzBebZIOG8CVlKapdAUGkBYmEKQE1tsBITU44I1kduRLAx9Bht63LDiRgTfgwrECB4Cql95llclZTOr8A3w8MAdA2gNFKhtPXoeexo58aeAjyFjo/V4VaE07QYCJJsuSCuKl8xKs/uw4nYhr8ETTgNK1oLpAxVcIJrMjX4vGxAbqqIQgun5yDDsoop9Uu90pgpSOYPxziVWDVwgm0yNflYX+7HhmaPFsHC2M5xJKt0ywV+iXBL5C+49AIBAIBGIfIPYBYh8g9gHS1vuA6FfeB4h9gNgHnPzs+4CG2AfsBrEPEAgEAoFRxtEU/cKUcUoiPtBl9orBvBdnJBwKS3+i5B+5QXXz86JDGC5vHBAVe3JUzuAXO+DCkU86hW5VTFKZSYicEqxyA8Br4BnRHUIjGZbAea3cbMGtp5x5UXHKH8/bc3ll9lQVRrlsGipjWg8NfqGDlG+hRXzEozou6Ty+H4+dRY/+qUNcOj6OaXGjRJwpwp1cduoEMYFpPkGAKz+tp/4VYsyTOpFyVZMowDDT7pS5Ag2+n8IGJBqlM+LcNqWWx0k9mSN+ABLiaMtYxtLjaX5rja+Uv5VjB8ttrn+pTs6465K6NMWsA8lNEBN4lQ8vVGs2vWaTyoyq5CX1ABp0z/NIwOIdGKfQes7QJ16nCrW3rodxv8oPoMn3L7m+2v7WJE7JCndohta3YFv1XQlM4E4mboLzAwPium6S+EqQ9YeVJFE65SyuyHUaT1zQQeBdQkMueUEcMAMfDygmtOdxYlogfknNTBDnemCZSVww+JQ4j9NPNwPo9v/jVkD3bVtKmnmDMak8YsV5SjOR7Haba1DKJlChwgyVat7BnTQcDpVqfrxSTSzTsixwZs/sIYZmDibIthGAt+e6Zo5DjTXY80KvxxqiUVPTn9wGrD56MqD1jNiFl1ECJWCnz/p9tKbfn4GdEk3qgftbiCMMTxA7dNozFXA9BZ1YIeI4MA+A0j9OUJGjEpdAOQIN0noQP1qF9eI2gGfCJcTDCpy/VdHRD9ArlqmxkrDQkEavc36ey0YFfH0XA3ohrdAebWcbSh+3srN9zdT67IJmGP54AGFoXrCS8bgwXypusp4qwWCgaVomj27WCfvEJAytz9wD9Cf6AX/CZ5CWfEFP84XmsvR9pDEJj27Rr4tAIBD7ALEPmO98HyD2AQ4sAfWj3e8DxD6gXtwH1LfeBzhP7wPkF98H+Hu3D3C33wdU+X3AcMf7gMv92gdYP/s+oJ3Lxk+wDyjt5z7gAuwDwPXO/2/2AediHyD2AS+BQCAQCCJ1h/X7jxEVNTkFHaybiQwEUEdOd3f16vyUjJiOCBmpKsjvjuh/yhGvu7vsXy7o1K1jFWwXjAWSYQfGiLR2Vz8t/3VKCOkCu427rfJd3i+hpJhwus7yt6aW+r4/N6ChdjFzy2hEcMf3U+CX54Tc7a5ebc2NqU9GeX7dx8Z8NGf1/lT12U7DoZrlb0+NuMQdJh3gsINEQYyy67rUUCasg6brLv5hffJkPVK7M4SmCc40TtQaMvAp09OV5ZWBBvnbYzuuYllhyAzZIhjCBhbVjkUTJBs2uLt6JClKjGZKXqIoM7ShF1010zLVsc3iW2MHGmrYE425xyAMUAFNs8GCZKgMYlY/2K7eMnt2ozdsZro57DU4bVIdt9qZ/pccN6ye2UQ7Q18bpRLT4XjDLh7prL/YDMPA3lm9FZqrJ+Qk0yehVdShJbUa+XHV1tkgDItH7HIe2qTxrHv7PO7pu6u/mVTG44sSi5cuNrTWBwW3uq6F4Q16RW70rev3EYFAIBAI/x85jooMB/6krr6ljMBv32uet2PlTBjsx3Gm9wvev8t1bKBFRAgwrKfLh+XbXOK1OzKbzL87wL93D+n8ynOcubmzUafVysbB9B5htGNSOZ5mUsIkMroY40d9pVzT73/5cJ2lq/iB8n7pfN+/R39FLYekuWF3iOcRBVGY9qjeH2pzhGMkZW6rbdTSNlbuMvPx6evy4d3y3TIbwKo51wzdpZx1xPv3cjSyCOngzP3GSlCpxFTwen+ouVhJFCWRmX9tL6Z3ufpj+fB2+e76+res3wfK16/1e//7/v2/U4l6/0Vtlv/uc4Eo0aGxofcDW67EFv2Lswsv2sq0FjcyP/Pb8sP92zfX098ftbxck94H2UQw58/tOAzDWrvWRoxyq9UZnW3oPcE+QWGMjjPZi8PAjs24lz0B9w9vPjz8gTI6y/vl8v6eaP3MnzucPz8Ix1rlolKJgGHGxPOIvKH3hcbBeMzc50EY6qjRD8eP+tOH9+/ff/iUx5v3a07ZAFucP7/RPut23K/FwBLHlcrAijf03qCf/83El/FYR7cfx9qjvupcX18rV3m88maNDPy53dbGRX/+9y2vLyazgm6gfUcgEAgEAsH/2jn7mKjOfI8/0JzMzkTmbsAyEIEJMMiWzGSCi2ZuaUN0iJPSGUNU3lJPloQV66SiF2ATimwZhS0LVCAgbwJoEVMrQIgCIvUNQxRcbWN9q2brxtb23r7dw3n5f59zZs7zPIfccSh7S2E9HzmTfPw9M/L7zm9mcs54zpkUyKFHS61Dsids2aQ/jol5DJ7Drc7OW4S+KYL15KzZbJ49fxL8DDRFGmWhMCXljE9sHZCxsSajDfmEcyzKAtVLlcslCExVoexJEh1AJsVFu1ywjvKQwP/AXZvF47HYquU0nvY8fPr0Yc9TlIltKilpygYw38fGfk9oKcuypVgPBUOeBB/C+U45nVPZgMRmcVpsZP9xygQKUxk+Re4nIyMjLAMyhR0SNoEa5HmBpqg+2TNDIZldNlSnGZpmUL2K4VmXi+WZKl97SZ7Q0LAwT5Kvxbp7EfcSEuBNndy/kYMYbbihq2FhV1FDuaU1lZWVNaW5KIAnwcF7njzBAdicU1NOGyCxJPQ4k8j+TXFFiv7ZKLoKEA2HhYVlJMkeFgoxdMiZVvEumABcTwbgyXSiCaEZgRZQPYVnWAhKOF98OPHx873+YURERFwcvPkQeDFyOl0Gw1mATE5CRkZCjmyldCwMIFZXigPYE9lCBJA9kZDTEzGRjTw7OyfBkn20B/dvgv1rFP272NRCgBqGEAGEevF0oABYmAARQJhU78IB6ARB0FXJyuoYnmd0bJXPdQapf6EKBQAJwQGMZURkRkQYugCix2DoQTLLrI1du3Zt5ix+CeyBExD8puwdTqczwunskP24pEmA7N9E9j+QyvJs6oCsSWE+fAFMhXo1VH4N5IsjzQv5/gLIp2lB4HX5srICQ1GMwObLzhggDIsmIDZEDCBEDsDifQYsAFEWEVGGZJySJkA7jt4TnwRP/sceHEBSaJghMzMTdewMMxgyPZZnuP8ZRf8XmliBTb0AcAChEnIARw1hkjqz5Y44FiaAA/B4A8hEAQg0zxMBCIzAwB8BBUAzOh1DowBCQsQAQlAAORYPHBALmvkfykYMhpGyH3xqpmJFKDMRwCh8D0ABTBkMYgBTOABRUQBFRUWK/k+mumi2CfcPLKEGiVCLLxCDF8sXOAAIOQFhygBoMQC6z6cHYLs0DVs+4PU+XnBBBL7PTwAgOycn5zjqH4R//qfNzJ8+D/eptbOGYZiaTisRQPATMgA4AcoAwjyZnuMwABSBBmByi3lXFNE/6LH46FE6+hToYyX60Mh462jkzvNiQvx5nzYc8NHg9fHuKIlu3wzbH957CLn38DEg6OnBAbS0dHcfawlHtYa5ubkGgDhPUdpELXVe9tPie0BExHXZEyQ9/gWQSdYAkobiplNg0eCOGvzXS1F9ObCazXNzZrMVLJUGsn8VFRUVFZVbMbfAdX/Fk/kiucrC7adbgIIvsraAxZFl/Sor6ytrFsD87uIbF38X2DGPcnOHweKx2QL1r405mY89S1Nkv4vsdCJEWwJINI5eoCTXcVuWgfyoqPwBVClJfQJJRQ/gNrU7HO0mN0C8PAL3cEdeDuiYlNQHtR/IcmHAaBy4gPJtM81oNDOmNiLhjg7wPC7HlGeUx87i9tvaZ/pNybJ3wv7Ly6+i3iG33W0aDSDpaUrIkvs3CgwvGFEClaxEpeztcOfU5HA4AOL9PcGjwXveJz3Yr0sYu5v7SuX+U43FxUa0d5M1Y4KPbjLN4ADudnXdRTIwbjZfNpvHB/D8f1NuuGco/+aWz5Nb29vbTcmoQXOiyGlZX+p39Lf39zvqAUFH5vEtsgzpeC0j0Pk4AAFCBGCIEyECeC14csdk8GukTyr8CZwAwkHtENM9NuiTUzd0FKW7cUoOoL3dMdMOA/YFYIN4POKt18ebmPiaeKZpHMh8E5MRxoRlxHyDRsCeTPQP+igIMyTr4PXr1w9chyj7z0bSTdPlFKOLQgHwAoRHAUSxElFEAHtcoy6yYXECnuO1g/ElJQ9qfVbSRJ06RTWVyAG4293u+vr6NjkAS2ameARLPkQ2x9QwPNzmAKKPi7sXx/UBTM6Ht7GcVwYwcMbLST/9g26eiS1PpHAAiRLPCaB0MtgVPFJGevBzvHY8fnwYIEqiqMFBKqpEdnt/vYhddltSqHi4wObTzlQKTgCV2kl0yMHDE9x5ov+6HEAGIIICuHByQQB3lf2DIcHF8C5hCAeg1Worv0MBdLM8hO0GMrnxpe+O/Ga/wv9L4eOi4/7L4bOPORcvHoCJP4cGuFccgCL8FmDb3tW13Sbb5ZqaGmnzH0BPXQ8gKKUg+FOgOvekxKBcn+hS9A9OdbvghBtPyb5J3HklJqDbRUNcKIDScitABPbhB+Vmsn9gLY/XauOJRVlFiv7BxHbIBPDP45sxMTE3HyP/sAeQzFIiJai/wS9FBuUGJ+RD0ghrSXd3CW7iwdrYyvLYyrX4JcBD8EugxAwwgd0s94+4nF5Skn4ZYNb39q7HVj1dNzFRN139L+x/Qx6ghmqtVyTkkevsAT+PudMSc2BpWK0fg0AoPqOzj9oAsB3NBisBFRUVFRUVW1KSjdBntqkp2zPgj+zs631917OzZU+BfA0WTU20lxr0zx1KSQnwGHsPH95L+rZt28DiybJrANDYs4A/JpyQCey2qLFQ7IV91QCSmyuX60IiGCYipE72YpZnjIUA+Pn/CG/K+OrRxmhtYiK8RQd4aFbkbSIATWNyo4YM4NIlZQCGnxPAbYdbo3E77LJrkjXShrA4jx51Wgjnxjwe5LUlQ9Xi/oBVLh9nKIjuuOypLPyL7kNoIARmXvz61pXiC4D1ggKIjk5MnIS3aNeCljhJ9J9sz9LgBPbuhRMAb4jn/9LzZqAxWaQRB+Cecbc53Ldlh/vWdrgRDYd5MjPJADI8XaHYb5UM1Q52W5Ef51jOxXJkAKyLpuQGU+ZjvxNommWr5ADegmxmiQlIVEzAlzoaovuS6MAuPkeog8NerqEAJCUCcEsU4QYhZIOatv76Xg1W2L2JnIAepyHT2YO9w9PlGevAvr4kPv4rrMd5FsKTAbh4monyaZUAA2AYhvcF0MdObp6fF9g+PAFX4YYnYJCWGASI5PVwQtejDrztX7tGTMBhxQT0uyH1D/1NAND0trURAQB7cnuyHRDkOJ05hGZbMjIs2bJl3XaEmBxufEjvuMBDBOUE8GyqHEBk7HfzDEO78r1e6roUmxg57yrFEzA6OUlMQAMtQOgGYgLE16i9kXgJXLsGbwBi2zXcfmDsvW298Id4D+iHfxS7J07lDnSPx4MH4jY8olXkcLS75WqC9xdOIANgXWwT+nZeS9G64mIUAL82aPLz/+RRANFSANE4AMEFAyUDgK//9XZyRsUAlv4pYG/t1Wh6W1EAyfXJdrg9J4Avusuxt7X322s17hAHCsD7mkUBlAzFsxA5gPP8jShB6I4Xznt91iWIuGaJCRiNJCbgnA72z/JWgNHcvHlT8SmwbdtesGTWP4a92x+vx4+ukTZMdoQygNqoymacX0jRFngndxsKQOAF+JOAVoPzLCQVfTs/PnvgwOz4gQafm734FETLyP0PCbB/VncO/HpkX7+u8Fpz5x3gl69OS3y14H8sjIOlcW78QGlp6WxDLVgJqKioqKhkgSwN+FXpmO4A/rl/caRl5OJ98IuhSSgqsmNd/jjuTmdM3wX+9o7vb4jkWT5yA07gyNZdW48AJXDncckUmRz9yWQgvRqQtZwp2LoyumxYNa3tbHsrSuD9RJYr4NjE91H/afPsfJoygb3kztKjXGP+AMA8O/P222ee+XdNW5wbt3tni8bUptHcdmiWbwBCY0OJEWhsd3D9IY2yHqR5Xq/TMQfl+q5jBSfoil3kk79Xccgkd4xhjABzJphlg8/496zeODwA6enpj01xbT/+aCjKWq4BcIZGe5w25MmOeqYN77zoOZrRMwyjxwGcYCYLcADbIJfInYchSquNAhgjy3GskXAuMZEjXOOOewlNQM2338a0mxxx/XHLFcCzaU+XoatrGs1kY31bSFsrmoA8HSORhwLIKwgqIAM4DP/sXfB9erwiAEFQBCBUVgrYNW6TyZEsdzv88Ra7w93a29ifvEwB2CxdXdFdXfgcI81LbXwrfkreHaV1O3W60XfRe8CuPL5g1xHi9a/sH5wqSYwfJDy3mOOKc0nX6QgvqofPOA78Y6BpbdRosho1W8CyMA2/PA+F27SfveP7m0bnXfOjm4hPgZ9++ukIwOwNsPNcbS0psVb79azG7zvtipO6pCPK68EyMf2pl2ngh/vvbtqx6d374Bdjy3D6LfBCc6vmY/BCc6dmGLzYfPu/4NdCRUVFReWdPypswzvSRlaVK/74jrThunL9BrFMugh0xHsb3gMKLvQt8PzqO2AZ2bDhFdLWbRA3sqpc8cqGDdJG1l8l1r8qlbGvE8EOi6/CuxBUD0WBBV7d3AyWj/BXw98jbF04CN8drqiSKySBG1mH9yHuv9B3v/UW8XivhL+6bl04SuByZ5+R6oai8OH0dLB8rFm3bg1hu9eANW+tUVTX7IYrSF+3G/tu6FCxw7LC36qoIB7v9XCR12XtjKUobTwUhS9zAH9eU6YwuCkaKiNXlPn+YkGdvD9cQroI8oVEXyrXUuUL/dtlDSAtrYy0P6eBtD+kkVXlirK0NGnDdek++P5imfQ/QLB/tkbkM1mb05ut8XIAyJuXNYCtZQrbtVXayKpyRdlWacN15fpdYpl0EegoEJE05QnhUBR+Z3gY/HuCA1kRqKioqKioqLzzDnnaqMSnNuCH6tpm8+X/rv5ZboW+cnkZ7tHCGx9197ZLfIrqzVc6O680I33TaEw1Gqt+jjfdgL5y+/8r+MtfwF/lBOq2syzn2b69DvV/NbayMrYTJXBIup7h22DRXmwwXMuEvlL5299BeDj4+99QAPC7QtYDA0D9S1xtxhc0hA1ehOLfU4uh4wDKr11awQGs+Qd4/XXwjzXEBHhCORTAlbUhIfCCfrFrrwQKADd8adul1TABOAAIEcB2D7udRQF0xsIEYACxnfJrGjWsdOUzTvpY0+FM6CuVs2mfAPBJ2lmffgqbVwYgJhAbMABlwx7Si4svNa3gAPanpZ09m5a2H02ARMKHPq+5evXq9/3wpsZfAKljYz8aCEcNK33l8gPcQ9/6A758hkTvU58Pp0NqYtLTh+WGghcEUDw2Vj4GHdf3NBUrPJjw1Y/VbD49Z7YS/sBsVvppP76iUFFRUVFRwecDLNrBmYtvvHHxzNJ939nPPju7b2ke+HqDuJ/AKM8HWKSDjyIFlhUiP1qqH8lrgeQdWZIHvt4g7meR4PMBsHMLncH+ySjLjk7C7RPCR5U+udCJ9fvyWioi54+15O0jPLKC9GPzC3zzZrQ+4PUH8e+/SPD5ANhphVN6Wo/9NYZlKf0kz7yGPSiI45Dr2Ek9tcCJ9WePVeyc5CN37tiKnWFOFCCvqNjMTyqd5fB6/9cfJH7/RD3qJyB6Ti/C6Ak/UbCTcFrQCwzyTexkUNBGfZBuE3JtUFBiEINdvzFoI1EP0m8k1qdVRFIUw2n1aciDKG0Q6RxDUYmE0wyjg/VA1x9E/TBBevT7BiZPx/MFPM/kYYeQzhTwBRTyTdzksaACIgAuSF9QcELpQccmsU9SQUHUJA4gkdIyXOSJXT7foWUYRqAUTlFa6PL6IIoK0hZIHvj6g3m60YICHYP6CQg+HwA7hPRInQv7+wwHBxKNNHQ4sCeUvjOS47Bz/LFjPPKtO2F6dGRBwVbkWo5Tuq5FT7qeYpD7v/4g7qeFx/0EBp8PgJ1/ju8fFbjRUU4Y3S87/385jV1Q+L6DO3ZGRu7ceXCff6fgS15RRx74eoP49w2I8nyARftHo/MsOz/60VL9yMGdkINHluKBrzeI+/nl2P+bETiBS/d94gGYfUvw/29UVFRUVFR+P9IiMvJ7P472rwOuX6Ucm2dF5o/5cbR/vcj1oNch0QtWCRUsx1XwtFBBOIedPB6grPtxEGKKm5mJM4WAVcJGjqM3MgyzkXAGOz4egOpwNbWRXE9t1OL1oN/EGuI4kxusAvwdD8COjwdgZ/RaPemUntJrkYP+fhNNz7S2rZoAeJ6Hm05POI8dHw9AdR2jZ3TEer0OGnLgrp/RCabWVrBKOMHT9Akabtgh2PHxAFx3KdaL5kIOWh2MycSvnjfBvEieZ3k+Mo9wHjvev/ZTR44CqHe0tjrqV80E7N+0Q2TTfj+O9q8Xu/5m60ut8OcmeHFRUVFRUSn8+gXvvyp3AKwWPkgpXGId8+x/sDTD/o3s7CoKIDV3aXXMo6rfypKefhn2L9wYBKsogEGFo1O3A9Rxy4+MUWjgo6/A/vkbp8Cq4c4HqQ13cLeQgUJ4s+g6SH821HQO2ZUPVln/oOZClDUdWUqqF+Oi6wD2T5zr/KjQyN2wPgKrh/STZIMXcnNzGwbhzaLr1UNNzTXNSKX+71wBq4jqKKvCa6PTA9exzTWlg3SifxbOf3T0agtg6fXLc2QcZ6T+02tqwCqitsT6r9SbCfk6X+wfpINh8GJS2Gc8BV5kng2sov5VVP4JqQSlVObhhkMAAAAASUVORK5CYII="); } \
						\
						.ui-widget-overlay { background: #{0[bgColorOverlay]}; } \
						.ui-widget-shadow { background: #{0[bgColorShadow]}; } \
					',
					options);
				};
			}
		},

		'475b4b70': {
			run_at: 'document_start',
			js: function(job)
			{
				$.theme(job.options());
			}
		}
	}
}

}; });
