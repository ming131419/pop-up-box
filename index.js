/**
 * The example of confirm$ usage mode
 * pxu($1, $2, $3, $4, $5)
 * $1 : represents the `type` of pop-up box(icon), can be isn't exist
 * $2 : represents the `title` of pop-up box, can be isn't exist
 * $3 : represents the `description` of pop-up box.The description can be html
 *      but must had `id="pxu"` attribute in input html.Example:
 *      <input id="pxu" type="text" placeholder="请输入登录密码" style="..." />
 * $4 : represents the `cancel button` of pop-up box
 * $5 : represents the `ensure button` of pop-up box
 *  pxu(null, '您确认继续重启吗？', '请确保您的信息填写正确后，提交后无法修改', '取消', '立即前往').then(res => {
 *    console.log(res)
 *  });
 */
// TODO Packaging usual window pop-up box
// TODO Add typescript .d.ts file
// TODO Packaging npm install package
window.pxu = (function (win, doc) {

  /**
   * Quickly selector
   * TODO Optimized selector. At present only support a single element.
   * @param selector
   */
  let $ = function (selector) {
    let t = selector.trim().substring(0, 1);
    let el = selector.trim().substring(1, Infinity);
    let type = {
      '.': function (el) {
        return doc.getElementsByClassName(el);
      },
      '#': function (el) {
        return doc.getElementById(el);
      }
    };
    return type[t](el)
  };

  /**
   * Init personal window
   * @param option
   * @returns {Promise<any>}
   */
  function personalWindow(option) {
    let self = this;
    self._options$ = Object.create(null);
    self._html$ = Object.create(null);
    self._box$ = Object.create(null);
    self._style$ = Object.create(null);

    let _icon_obj = Object.create(null);
    _icon_obj = {
      'close': '<svg version="1.1" id="Layer_1" x="0px" y="0px" width="20px" height="20px" viewBox="0 0 40 40" enable-background="new 0 0 40 40" xml:space="preserve">  <image id="image0" width="40" height="40" x="0" y="0"\n' +
        '    href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAQAAAAm93DmAAAABGdBTUEAALGPC/xhBQAAACBjSFJN\n' +
        'AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElN\n' +
        'RQfkChQBDgU74ZhrAAABbUlEQVRIx9XWP0vDQBgG8OeunKNQxQ/h4lJwMUvAzkJ0c3Hs4hwXu9pv\n' +
        '4Bdw8Au0gwUbtAhCMzv5ESSrsZjXIaSSP3f3XoiDlykZfhyX93k4Qeh2yY69PwOji8Xdst+OiEaL\n' +
        '+1hVQDqm8/W8DRmF2S1OvrcroLoUMQ3cySjMJvjC2eFHBfQSNXQnc04E/rR2hm3IJq70l93IZq4y\n' +
        'NnxSx9XmkEfquYbBtpMmrjEpZtLMaaKnJ22cNsvNpJ0zlEOd5HDGtimTPA4Q5oJd9tdzGogYUxpz\n' +
        'OCtYkACPYxSsl2AGAHhXL3aOAT5e0TVSvGGfl3ELGIW4QSqCrSNubUgzl02QisCf8WtDcrj8LHmk\n' +
        'tHCnOccnpYUrDQqHlHyOR0oXjkNKN85OVqLHrYAi42roJYYdcjnTLmUbzkTKdpyeLG5fI1euRD6g\n' +
        'VwHJF5+u3IZc0cHzzuYTgUBYqdddQsun97T3+2ZtbNf1b+7Y3a0fRhlsYsgFUAoAAAAldEVYdGRh\n' +
        'dGU6Y3JlYXRlADIwMjAtMTAtMTlUMTc6MTQ6MDUrMDg6MDCMswf1AAAAJXRFWHRkYXRlOm1vZGlm\n' +
        'eQAyMDIwLTEwLTE5VDE3OjE0OjA1KzA4OjAw/e6/SQAAACB0RVh0c29mdHdhcmUAaHR0cHM6Ly9p\n' +
        'bWFnZW1hZ2ljay5vcme8zx2dAAAAGHRFWHRUaHVtYjo6RG9jdW1lbnQ6OlBhZ2VzADGn/7svAAAA\n' +
        'F3RFWHRUaHVtYjo6SW1hZ2U6OkhlaWdodAA0MIm7Dx8AAAAWdEVYdFRodW1iOjpJbWFnZTo6V2lk\n' +
        'dGgANDBxFM+SAAAAGXRFWHRUaHVtYjo6TWltZXR5cGUAaW1hZ2UvcG5nP7JWTgAAABd0RVh0VGh1\n' +
        'bWI6Ok1UaW1lADE2MDMwOTg4NDXhVk9TAAAAEXRFWHRUaHVtYjo6U2l6ZQA1NTdCQkTcl8MAAABG\n' +
        'dEVYdFRodW1iOjpVUkkAZmlsZTovLy9hcHAvdG1wL2ltYWdlbGMvaW1ndmlldzJfOV8xNjAyNTc3\n' +
        'NzEzMTQxNDcyM184M19bMF1Lp3vxAAAAAElFTkSuQmCC" ></image>\n' +
        '</svg>',
      'type': {
        undefined: '',
        'warning': '<svg version="1.1" id="Layer_1" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 52 52" enable-background="new 0 0 52 52" xml:space="preserve">  <image id="image0" width="52" height="52" x="0" y="0"\n' +
          '    href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAMAAADypuvZAAAABGdBTUEAALGPC/xhBQAAACBjSFJN\n' +
          'AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAulBMVEX/////1VX/yEP/w0L/\n' +
          'w0L/xEP/xET/x0j/w0T/w0L/xEL/xUT/xEP/xEL/x0b/xEL/w0L/w0P/w0L/w0L/w0P/yUb/w0P/\n' +
          'xUP/zE3/xkX/w0L/w0L/w0L/20n/xEL/w0L/w0P/xUT//4D/w0P/xEL/xET/xEP/w0T/xEL/w0T/\n' +
          'yEn/xUb/xUL/w0L/w0L/w0T/xkP/yUP/w0T/xUP/xUr/xEP/xE7/xEX/xEP/zET/xEP/xUX/w0L/\n' +
          '///DYo9+AAAAPHRSTlMABi5Vd4aTIHi89kvC/jfB89rApvQhq1wUQ+7ITQds+9lTBJn6cexA1CIO\n' +
          'FmCqzGZME2JyH6wNTscPw10v5PdRAAAAAWJLR0QAiAUdSAAAAAd0SU1FB+QKFAENO9Gt1gMAAAHn\n' +
          'SURBVEjHnVbnmoIwEFxFVBT7gb0rite83vb9n+smKHdKEsHsH8km47c7W4kUkstbBbtYtAtWPkeZ\n' +
          'pFR2KvwnFadcSoVU3RonpOZWL0LqjePDZqvd6bRbN8dju66FeP4B4Hd7sarX9ZuR0vfUmP5A3A5H\n' +
          '43P1eDQU+kFfhZlMcTWbq67mM1xNJ5J+sYR+tV6ojVisV7heJm8FJtjoKdoEApWwDapteInYcIsn\n' +
          'Zxb24c92dzEatANqesKGB96CkFIkhIWDf+YRn5Xkz619l/QLbPjxoQ5r19If3zMnQ7PGwzg3kDsz\n' +
          'mesH5sck84hX4/C5B14RUwWI5ni6j75c5A5lAxEyyo2oQy2MsoJGqBRRX2Xk9TgraIycL+PXOeEx\n' +
          'FSSi46AfoLa72UFddIAc5UHIU3ZQD8/zZMElyg4iOGVRAZG9BtRiLpCNtnENqM1sU5G5cw2ow1w0\n' +
          'AxmZByJaVxNhRLkIbi876BBcbRqhCp5l7SGNtAn7wsGrrH2LElZbGlR6l3VxaeiK8CP4/JKUcRHq\n' +
          'yv2b+UflaFTuusaiAonGchyL6hamMO+khWmapUJOm6W6Lcty1pbNBoDRqDEbambj02xQG60EZLZ8\n' +
          'mK05JC9UzeOxoV+ohOxVq9ue0sRLLoleKiSStHX0Fx1xeajOut9yAAAAJXRFWHRkYXRlOmNyZWF0\n' +
          'ZQAyMDIwLTEwLTE5VDE3OjEzOjU5KzA4OjAw4S94nAAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMC0x\n' +
          'MC0xOVQxNzoxMzo1OSswODowMJBywCAAAAAgdEVYdHNvZnR3YXJlAGh0dHBzOi8vaW1hZ2VtYWdp\n' +
          'Y2sub3JnvM8dnQAAABh0RVh0VGh1bWI6OkRvY3VtZW50OjpQYWdlcwAxp/+7LwAAABd0RVh0VGh1\n' +
          'bWI6OkltYWdlOjpIZWlnaHQANTJ+rl9yAAAAFnRFWHRUaHVtYjo6SW1hZ2U6OldpZHRoADUyhgGf\n' +
          '/wAAABl0RVh0VGh1bWI6Ok1pbWV0eXBlAGltYWdlL3BuZz+yVk4AAAAXdEVYdFRodW1iOjpNVGlt\n' +
          'ZQAxNjAzMDk4ODM5p6GVvwAAABJ0RVh0VGh1bWI6OlNpemUAMTQ3MUJCuL89AwAAAEd0RVh0VGh1\n' +
          'bWI6OlVSSQBmaWxlOi8vL2FwcC90bXAvaW1hZ2VsYy9pbWd2aWV3Ml8xMF8xNjAyNTc3ODg3OTUz\n' +
          'MjQ4Ml82N19bMF0XpaCQAAAAAElFTkSuQmCC" ></image>\n' +
          '</svg>\n',
        'success': '<svg version="1.1" id="Layer_1" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 52 52" enable-background="new 0 0 52 52" xml:space="preserve">  <image id="image0" width="52" height="52" x="0" y="0"\n' +
          '    href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAMAAADypuvZAAAABGdBTUEAALGPC/xhBQAAACBjSFJN\n' +
          'AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABMlBMVEX///+A1St/2CF+1SF+\n' +
          '1CKA0yJ/1COA1yh/1CJ+1CJ+0yGB1iJ+1CJ+1CGC1SV/0yF/1CJ+1CJ+0yF/1CJ+0yGD2Cd/1CJ/\n' +
          '1SGA2SaB1SJ+0yF+1CGB1CGS2ySA1SF/0yJ/1CKB1CKA/0B/1CF+0yJ+1CJ+1CGA0yR+1CKA2iZ/\n' +
          '2ySA0yKA/4CD0ySG2yR/0yJ+1CGE0yOL6C5+1CJ/1CJ/1CF+1COG1yj///+A1SF/1CGA1SF/0yKA\n' +
          '1St/1CJ/1CKA1CN+0yKC1CN+1CGB1iF/1CJ+1CKC1SSA1SN+1CJ+0yN/1CF/0yGA3CN+0yKB1iN/\n' +
          '1CGA1SGA1CKC1SF/0yF/1CJ/1CGC1yJ/1CF+1CKE1il/0yF/1CJ+1CKA5jN/0yJ+1CF+0yGA1iOq\n' +
          '/1V+0yH////m5ZHXAAAAZHRSTlMABi5Vd4aTIHi89kvC/jfB89rApvQhq1wUQ+7ITQds+9lTBJn6\n' +
          'cexA1CIOTAIjFc3gHQvKgbdlEwGiuYrLDHDbWOg7zkX58jFg4lf9kRZvUfeoiD3vvaEt5bYf18ms\n' +
          'CrXm2CwD90b9SwAAAAFiS0dEAIgFHUgAAAAHdElNRQfkChUXFw6XJFBcAAACdklEQVRIx52Wd1vb\n' +
          'MBDGlWUcCJmNM0hwYrJMWmjpCKVQoC1Q6N576/t/hr4n2xm2bOfR/WPppF8i3dIxJpFEMpXOaFom\n' +
          'nUom2FKyomdX+VRWs/pKLLKWW+c+Wc+tRSL5gruxWCpXKuXSNXdazociVcMBjFrdU9VrRlEojaqc\n' +
          'aTRpdaPVXlS3WxukbzZkzKaJpU5XttTtYMncDOitLeh7fUt+CKvfw/KWf5WYwTDcRMMBUb6zQTWy\n' +
          'owxrj7Bl4YQN3Ge0HekNtg3KnLNGFXYb2CxGbJywObM8/NMbxjG4F6xheJM8TtuPZxjrY6MXG4id\n' +
          'jrUMZMFfBWc4Bt9dhoGXsXUsRjnEznIMY4ionDAdcqEVufP6jWkqtpAplF864rodxezs8pu33HEb\n' +
          'Ma/jm52zo0z2buMid7wZvJNFPUBu16IsdpcS4543raECJFgSqkk4s3+fmIOpR+qYJVkKV4r4owfE\n' +
          'HB7NFLhUiqXh2XDmITHHO3OaEudplkHZCGVOqDSdLoRymfMM0zivzFSPHu8+mc0aZ2DOLxZ+p8K5\n' +
          '5oMQXOZTb3JxDubMV1AEtHi8S7qD7oztU6qUV74Ti+PBEKWZKvWMqOf7GL44puFL/zWFIXwmf/Wa\n' +
          'tr5JsKNDGrwN2EaYnJxbn1O+e0+bP0wO6PMxwDjODYTRp8+0nWzAvwRT0wmjYMB+/eaW/e97Qc/9\n' +
          'EAErSY2JKN68Uw8yXmpIkvDnLzC/ZY+Zl4SydLc0889fCTNNd3lh+SdDRGFxn0WVEqZWLJXKstoD\n' +
          'oPTUqD1qas+n2kOt1BIwteZDrc1hwYaq6E4L4Q0VyVjWuo1ZnFT9TWI1FhES147+B90JynKC+/GP\n' +
          'AAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIwLTEwLTIxVDE1OjIzOjE0KzA4OjAw3YUAJwAAACV0RVh0\n' +
          'ZGF0ZTptb2RpZnkAMjAyMC0xMC0yMVQxNToyMzoxNCswODowMKzYuJsAAAAgdEVYdHNvZnR3YXJl\n' +
          'AGh0dHBzOi8vaW1hZ2VtYWdpY2sub3JnvM8dnQAAABh0RVh0VGh1bWI6OkRvY3VtZW50OjpQYWdl\n' +
          'cwAxp/+7LwAAABd0RVh0VGh1bWI6OkltYWdlOjpIZWlnaHQANTJ+rl9yAAAAFnRFWHRUaHVtYjo6\n' +
          'SW1hZ2U6OldpZHRoADUyhgGf/wAAABl0RVh0VGh1bWI6Ok1pbWV0eXBlAGltYWdlL3BuZz+yVk4A\n' +
          'AAAXdEVYdFRodW1iOjpNVGltZQAxNjAzMjY0OTk0p3Pi3QAAABJ0RVh0VGh1bWI6OlNpemUAMTky\n' +
          'OUJCeeJYOAAAAEZ0RVh0VGh1bWI6OlVSSQBmaWxlOi8vL2FwcC90bXAvaW1hZ2VsYy9pbWd2aWV3\n' +
          'Ml85XzE2MDI1Nzg0NTk1NTI3OTg1XzU3X1swXXOsUVcAAAAASUVORK5CYII=" ></image>\n' +
          '</svg>',
        'shutdown': '<svg version="1.1" id="Layer_1" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 50 52" enable-background="new 0 0 50 52" xml:space="preserve">  <image id="image0" width="50" height="52" x="0" y="0"\n' +
          '    href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAA0CAMAAAD/uJueAAAABGdBTUEAALGPC/xhBQAAACBjSFJN\n' +
          'AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAC0FBMVEX////7Uy/5US/5US//\n' +
          'Uy/5US75UTD5UTD5UTD/VRz5TzD8Ui//AAD/VSv5UTD8Ui7/VQD5US/6US/6US/6Ui/5UC/6Ui7/\n' +
          'gAD5Ui/5US/5Ui/5US/6Ui/7TzD/Tif6US/7UDD6UTD6US/5US/5US7/QED4Uy36UTD5US/7UC/y\n' +
          'TTP6US/5US/4US/xRyv6Ui76US/6US/5UC//US74Ti76US/5US/2Ui76UDD5US74UC/4UjH6Ui/6\n' +
          'US72TC/2Tyz7UjD4US/6US//Ri7/SST6US/6UTD/USj5UTL5US75US/6US/6Ui//TTP5US76US/6\n' +
          'UTD2Tyz5US76US/8UDH5US//VS//AAD5UC78UjD6Ui/6Ui78UC/7US/5US/6UTH5UC/5Uy35UzD6\n' +
          'US/5US/6US/0Tiz6US75UC/4Ui/6Ui/5UC//VTn4US/6UjD5Ui75UTD5US/wSy36UjD6US77US75\n' +
          'US75US/7Ui76US/6US/5US76US/5US/6US76US/5UC/6US/6Ui76US/4US/6UjD6US75US/5UC76\n' +
          'UjD5US/6US76US/6US/4US76US/5US/5Ui/6US/5Ui/3UDD8US/8Ui36UDD3UjHqVSv5US/5US/5\n' +
          'Ui/5Ui7/UTb7Tyz6Ui/7UTD5Ui75US/7UTD5UDHvUDD6US/5Ty35UC76US/6UC//Ui74UTD6US/6\n' +
          'UTD/TTP6US/6Ui/4TjL5Ui/rTif4US//VTP4Ty76UTD5UC/5Tiz5US/yTSb4US/6UTD8UzD5UDD5\n' +
          'US/6US/5US76US/5Ui//Uyz7UC75US/3UC77US/5UTD8UTD/Wzf6US/6Ui/7US/7Ui/7US7/UDD/\n' +
          'XS78UC35Ui/5US/5Ui//YCD7Ui/6Ui/6US/5US//Ty35US/6Ty7/Tyz6US74UC76US/6US75US74\n' +
          'US76Ui76US/5UC/6UDD8Ty75US////+ET/4IAAAA7nRSTlMAR+bYK8yh3LEJWlEBBlVOA3focZjb\n' +
          'YwJR36/XzjoN7kBf+fyEBCLW8IIUl/m/EjLq/p8WJ7rZHDDt605t9xsdO+rPCwfN0BMp562N2xQs\n' +
          '8GU6/fFJ8xsCy2CMpVa3/i/7KFCno/oXmlxz6s4JxDV6pvsRcF5IofZ5x/Xi2fXMka+90fiUm8DQ\n' +
          'pWBS0b/Swe2qrOmCIExaYB8M+t3etRM6XXvLgbBZEOstU9BsHEXEpgrKniSfDcIPTcb0LrcUJtFK\n' +
          'duNo8mGyLkPJQzy2Tw7Joq1zQiALSX25iQhByP20Lfg3HW678+ywdI+Og29NicyZjQAAAAFiS0dE\n' +
          'AIgFHUgAAAAHdElNRQfkChUXMy8qpaGkAAAC2UlEQVRIx5WW9V8UQRjGXwwUPRQDMRCLUEGRFBUb\n' +
          'BUVFTxQsRBETsLtFBWxRDBC7wE7MUxHs7sZun7/Bd5c49ti7G94fdt553ue785mZ3Z0lUg+LMmXL\n' +
          'UemiPGBZSqQCUFHMaVWpskaJWFepamMKqFYdqKFEagK2teyMEbXrgKOuEqknafb1VQEHS6mIBg2V\n' +
          'SKPGktrE0akk4ewilZo2a244fWdXN6nSoqUh4d6KZQ9PL7UV8/aRGN/WSsKvDYtt2xlbZP/2XLbt\n' +
          'UJzoWIYlF2fj+9KpMxu6dNULAd1Y6B5oaiuDerClp74fzN1evckUQn1C2NS3sNdPC/QPItMIhbJr\n' +
          'wMD8PCyc+UFkDqHBbBuSnw7ldBiZRwJYixgup/ZA5AgBhEbyvaPk9eNkFIkg0s2jR3M7hhE/MWQs\n' +
          'W8fx5McDE0gMieGFjiWKY3KiIEKTgMlTaCoj7qLINDZPpxnATBtRxJuRWTQbCCdRJGwO4ElzFU+b\n' +
          'GYTmAT40H3AVR2KBBcSv9kKVmi+wSEVeDCyheGCpSm1Z4ddJGcuBBOJXJ1GlZp20QkWllcAqWg2s\n' +
          'IeFYC6yj9UCyMOHF++JIG/i6URRJYfMmsuDrZlFEejG30NZU4WOBKA3Yxk06EL9djNjBgwRzu5Pb\n' +
          'XWJIFFvjuLXir3GygwjhHQnslrM98soJxF427pOz/Qd4NgfNExlMZBacZ4c4T4gxRxxO5tPkSEHH\n' +
          '7igzxzSmieMn2HSyqHtK+kSftjNFnDnLlrQsvXBOK43jZJzIOs+GCxeLS/4eLF26bIzQXeGy21Wl\n' +
          'eC2CxewUVUBzPUciMgz13FTpDL1xsyRx67ZUCblTsnI3W6po790PKK4+SHoo/w5k6tTGD3wUIVdz\n' +
          'Hj95+iyGNM91L16+ipel6NdvjMzy7TsUhfZ9UerxIc/E8oema2EQHxM/ken4/OXrN73/+4/cQBII\n' +
          'm7yMn46/fv/5+0+n9hT9B2rY0X97mGhEAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIwLTEwLTIxVDE1\n' +
          'OjUxOjQ3KzA4OjAwiUPRYAAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMC0xMC0yMVQxNTo1MTo0Nysw\n' +
          'ODowMPgeadwAAAAgdEVYdHNvZnR3YXJlAGh0dHBzOi8vaW1hZ2VtYWdpY2sub3JnvM8dnQAAABh0\n' +
          'RVh0VGh1bWI6OkRvY3VtZW50OjpQYWdlcwAxp/+7LwAAABd0RVh0VGh1bWI6OkltYWdlOjpIZWln\n' +
          'aHQANTJ+rl9yAAAAFnRFWHRUaHVtYjo6SW1hZ2U6OldpZHRoADUwaA/+0wAAABl0RVh0VGh1bWI6\n' +
          'Ok1pbWV0eXBlAGltYWdlL3BuZz+yVk4AAAAXdEVYdFRodW1iOjpNVGltZQAxNjAzMjY2NzA3Ty/t\n' +
          'rwAAABJ0RVh0VGh1bWI6OlNpemUAMjIyNEJCgH6I1AAAAEZ0RVh0VGh1bWI6OlVSSQBmaWxlOi8v\n' +
          'L2FwcC90bXAvaW1hZ2VsYy9pbWd2aWV3Ml85XzE2MDI1Nzg4MDg4Mjc4NTQ5XzgzX1swXQZ9eeYA\n' +
          'AAAASUVORK5CYII=" ></image>\n' +
          '</svg>',
        "restart": '<svg version="1.1" id="Layer_1" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 52 52" enable-background="new 0 0 52 52" xml:space="preserve">  <image id="image0" width="52" height="52" x="0" y="0"\n' +
          '    href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAMAAADypuvZAAAABGdBTUEAALGPC/xhBQAAACBjSFJN\n' +
          'AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABOFBMVEX/////xUP/w0L/xEL/\n' +
          'xEH/yUP/wkL/w0L/zED/xET/xUP/wUL/wkH/v0D/xUL/yEP/yED/xUH/v0D/w0H/xEL/xUP//wD/\n' +
          'wkP/xEL/xEL/wUX/w0P/xUP/w0L/w0L/w0H/w0H/xEH/xEH/w0L/v0D/wkP/xEH/xDv/w0H/xEP/\n' +
          'wkL/xEP/qlX/xUL/wkH/w0T/w0L/zE3/w0H/w0H/tkn/xEL/xUL/w0P/w0L/xEL/xEP/1VX/xEH/\n' +
          'xkL/wEP/w0L/w0L/gAD/xkL/w0L/wkH/xkD/w0H/wUT/zET/w0L/w0L/w0L/1Sv/wkT/w0H/v0D/\n' +
          'xEL/xUT/w0P/xEL/w0L/v0D/x0D/w0L/wkL/xEH/wkH/w0L/xkT/w0L/xjn/xEL/w0P/zDP/xkH/\n' +
          'xUb/w0H/w0L/w0L///+aOoL3AAAAZnRSTlMAWOPkWhP4+BQ4OTo7BEIuHEsUw/6QAVT17CWVVPqI\n' +
          'L5VxlMUIKisNlLS1hQNGR0T7Crv2B61gJtX9sAYnOjlZrgJZ5EMovy0PntGMBlPeDNJTjbWvKCD2\n' +
          'sVY/8zF3CbHDBT8WXuewiltxAAAAAWJLR0QAiAUdSAAAAAd0SU1FB+QKFRc1L3z/BiIAAAGWSURB\n' +
          'VEjH7dZXU8JAEAfwVZoUERGwIBZstBiQKIqgYseOvTdgv/9H8AJBuAt3BB8cH/w/ZTf3m7m53OwE\n' +
          'gJOeXpMZuozFimjr6xLZkcTRJXKqyPVnUL97oAPyDHpZM4Q+f0CEhkdwdIxGbnVNUIDGQ6SeoNGk\n' +
          'T100xUU1g9PM/vxqE8McVDczswwKBGk1p1bztFnQHZ+mIo06ihjrZEjCNRXXqoS0mKg/yQKjqWSK\n' +
          'bS+JDECEvE0rbHdZaADiyfSKrplZXcsKDEBKadddh/9wYrE7tWREy3J5LRsWgE0rfmerwCOFbHOV\n' +
          'bRt2sCW7PCS3rjKBqbWUDSKzrVlljW2PjGuvw6Vlz/BB/KddpP3Yga55WDw6PuGbUzJ3zgJst0i+\n' +
          'TVQRGcRztn2BAlWqmaiuf4l8VaJnYkGWtUulXHEVY4BctmvooFhzo5Y5sbq9Y2ZvXq3zQKt7+mQf\n' +
          '2HlNo4Z6pJDniZnXDNKURO/vOfLyCgIEyhvi+wcIo0MQ+JQ6mDbIQH4POX7y61YmNyRU7hJBpVqt\n' +
          '8N59ARvOsRbT63atAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIwLTEwLTIxVDE1OjUzOjQ3KzA4OjAw\n' +
          'jbYBXQAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMC0xMC0yMVQxNTo1Mzo0NyswODowMPzrueEAAAAg\n' +
          'dEVYdHNvZnR3YXJlAGh0dHBzOi8vaW1hZ2VtYWdpY2sub3JnvM8dnQAAABh0RVh0VGh1bWI6OkRv\n' +
          'Y3VtZW50OjpQYWdlcwAxp/+7LwAAABd0RVh0VGh1bWI6OkltYWdlOjpIZWlnaHQANTJ+rl9yAAAA\n' +
          'FnRFWHRUaHVtYjo6SW1hZ2U6OldpZHRoADUyhgGf/wAAABl0RVh0VGh1bWI6Ok1pbWV0eXBlAGlt\n' +
          'YWdlL3BuZz+yVk4AAAAXdEVYdFRodW1iOjpNVGltZQAxNjAzMjY2ODI3dkXIEAAAABJ0RVh0VGh1\n' +
          'bWI6OlNpemUAMTMzMEJChD8ccwAAAEZ0RVh0VGh1bWI6OlVSSQBmaWxlOi8vL2FwcC90bXAvaW1h\n' +
          'Z2VsYy9pbWd2aWV3Ml85XzE2MDI1Nzc5NjQxNDA0ODI4XzMxX1swXUu43B8AAAAASUVORK5CYII=" ></image>\n' +
          '</svg>'
      }
    };
    self._box$.type = _icon_obj['type'];
    self._options$ = option;
    // Create and additional html
    self._html$ = {
      popLayer: 'div',
      popBox: {
        closeIcon: 'div',
        type: 'div',
        title: 'div',
        des: 'div',
        btnBox: {
          btnCancel: 'button',
          btnEnsure: 'button'
        }
      }
    };

    self._box$ = personalWindow.createBox(self._html$, doc.getElementsByTagName("body")[0]);
    self._box$.closeIcon.innerHTML = _icon_obj['close'];
    self._box$.des.innerText = self._options$.des;
    self._box$.btnEnsure.innerText = self._options$.ensure;
    self._box$.btnCancel.innerText = self._options$.cancel;
    // Create and additional style
    self._style$ = personalWindow.createStyle(self, doc.documentElement.firstChild);
    self._box$ = personalWindow.variable2class(self._box$);
    personalWindow.addStyle(self._box$);

    // Determined whether type icon is exist
    personalWindow.existOf(self, 'type', {
      "flex": "0",
      "align-self": "center"
    });

    // Determined whether title is exist
    personalWindow.existOf(self, 'title', {
      "flex": "0",
      "align-self": "center",
      "font-size": "14px",
      "font-family": "PingFangSC-Regular DOT PingFang SC",
      "font-weight": "600",
      "color": "#232323",
      "padding-top": "15px"
    });

    // Determined whether des is exist
    personalWindow.existOf(self, 'des', {
      "flex": "auto",
      "padding-top": "28px",
      "align-self": "center",
      "font-size": "14px",
      "font-family": "MicrosoftYaHei",
      "color": "var(--default-font-color)",
      "line-height": "19px",
    });

    return new Promise((resolve, reject) => {
      personalWindow.on(self._box$.closeIcon, 'click', function () {
        resolve(null);
      }, false);
      personalWindow.on(self._box$.btnCancel, 'click', function () {
        personalWindow.removeAll();
        resolve(false);
      }, false);
      personalWindow.on(self._box$.btnEnsure, 'click', function () {
        let v = $("#pxu")['value'];
        personalWindow.removeAll();
        resolve(v ? v : true);
      }, false);
    })
  }

  /**
   * The handle of event function
   * @param element a tag in html
   * @param eventName
   * @param handle a function
   * @param capture
   * @private
   */
  personalWindow.on = function (element, eventName, handle, capture) {
    if (element.addEventListener) {
      element.addEventListener(eventName, handle, capture);
    } else if (element.attachEvent) {
      element.attachEvent('on' + eventName, handle);
    } else {
      element[eventName] = handle;
    }
  };

  /**
   * Create html tag in parent tag
   * @param html
   * @param parent parent tag
   * @private
   */
  personalWindow.createBox = function (html, parent) {
    let res = {};
    let deepCreate = function (obj, parent) {
      if (!obj) return;
      for (let _k in obj) {
        if (typeof obj[_k] === "object") {
          res[_k] = personalWindow.createTag(parent, 'div', personalWindow.camel2underline(_k))
          deepCreate(obj[_k], res[_k]);
        } else {
          res[_k] = personalWindow.createTag(parent, obj[_k], personalWindow.camel2underline(_k));
        }
      }
      return res
    };
    return deepCreate(html, parent);
  };

  /**
   * Create style tag in parent tag
   * @param self
   * @param parent
   * @returns {*}
   * @private
   */
  personalWindow.createStyle = function (self, parent) {
    this._style$ = this.createTag(parent, 'style', 'style');
    this._style$.setAttribute('type', 'text/css');
  };

  /**
   * Add style in style tag
   * notice:
   * DOT/dot equal to ,
   * @param box The style from the method _create* in personalWindow
   * @returns {*}
   * @private
   */
  personalWindow.addStyle = function (box) {
    let _default = {
      ":root": {
        "--btn-color": "#2590fd",
        "--btn-active-color": "#54A0FD",
        "--layer-bg-color": "#000",
        "--default-bg-color": "#fff",
        "--default-font-color": "#666",
        "--input-placeholder-color": "#cfcfcf",
        "--input-border-color": "#d0d0d0"
      },
      "input": {
        "width": "18em",
        "height": "2.5em",
        "border": "1px solid var(--input-border-color)",
        "border-radius": "0.3em",
      },
      "input::placeholder": {
        "color": "var(--input-placeholder-color)"
      },
      "input:focus": {
        "outline": "none",
        "border": "1px solid var(--btn-active-color)"
      },
      [box.popLayer['class']]: {
        "position": "fixed",
        "background-color": "var(--layer-bg-color)",
        "top": "0",
        "left": "0",
        "right": "0",
        "bottom": "0",
        "opacity": "0.3",
      },
      [box.popBox['class']]: {
        "position": "absolute",
        "transform": "translate(-50%dot-50%)",
        "width": "380px",
        "height": "230px",
        "top": "50%",
        "left": "50%",
        "border-radius": "5px",
        "background-color": "var(--default-bg-color)",
        "display": "flex",
        "flex-direction": "column",
      },
      [box.closeIcon['class']]: {
        "flex": "0",
        "align-self": "flex-end",
        "margin-top": "14px",
        "margin-right": "14px"
      },
      [box.closeIcon['class'] + ":hover"]: {
        "cursor": "pointer",
        "opacity": "0.8"
      },
      [box.btnBox['class']]: {
        "flex": "0",
        "padding-bottom": "30px",
        "align-self": "center"
      },
      [box.btnBox['class'] + " button"]: {
        "padding": "6px 41px",
        "background-color": "var(--default-bg-color)",
        "border": "1px solid var(--btn-color)",
        "border-radius": "5px",
        "cursor": "pointer",
        "outline": "none"
      },
      [box.btnBox['class'] + " button:hover"]: {
        "opacity": "0.8"
      },
      [box.btnBox['class'] + " button:active"]: {
        "border-color": "var(--btn-active-color)"
      },
      [box.btnBox['class'] + " button:last-of-type"]: {
        "margin-left": "30px",
        "background-color": "var(--btn-color)",
        "color": "var(--default-bg-color)"
      }
    };
    this._style$.innerText = this.obj2css(_default);
  };

  /**
   * Append style in css
   * @param style
   * @private
   */
  personalWindow.appendStyle = function (style) {
    this._style$.innerText += this.obj2css(style)
  };

  /**
   * Determined option exist
   * @param self
   * @param item
   * @param style
   * @private
   */
  personalWindow.existOf = function (self, item, style) {
    let option = self._options$,
      box = self._box$;
    if (item && option[item]) {
      box[item].innerHTML = option[item];
      this.appendStyle({
        [box[item]['class']]: style
      })
    }
  };

  /**
   * Tag create method
   * @param parentTag
   * @param tagType
   * @param tagName
   * @returns {HTMLElement}
   * @private
   */
  personalWindow.createTag = function (parentTag, tagType, tagName) {
    let box = doc.createElement(tagType);
    box.setAttribute('class', '_class_' + tagName);
    box.setAttribute('id', '_id_' + tagName);
    parentTag.appendChild(box);
    return box;
  };

  /**
   * Delete all style
   * @private
   */
  personalWindow.removeAll = function () {
    // The pop-up box hide by animation
    // let opacity = 1,
    //   timer = setInterval(function () {
    //     if (opacity <= 0) {
    //       clearInterval(timer);
    //       $('#_id_pop_layer').remove();
    //       $('#_id_pop_box').remove();
    //       $('#_id_style').remove();
    //     }
    //     $('#_id_pop_box')['style']['opacity'] = (opacity -= 0.1);
    //   }, 50);
    $('#_id_pop_layer').remove();
    $('#_id_pop_box').remove();
    $('#_id_style').remove();
  };

  /**
   * The method is using object(JSON) transform css style,but element in obj must add "" character
   * @param obj json or obj in js
   */
  personalWindow.obj2css = function (obj) {
    // return JSON.stringify(obj).trim()
    //   .replace(/^\{|\"|\}$/g, '')
    //   .replace(/\,/g, ';')
    //   .replace(/\}/g, ';}')
    //   .replace(/\:\{/g, '{')
    //   .replace(/\}\;/g, '}')
    //   .replace(/DOT/gi, ',');

    let _css = JSON.stringify(obj).trim()
      .replace(/^\{|\"|\}$/g, '')
      .replace(/\,/g, ';')
      .replace(/\}/g, ';}')
      .replace(/\:\{/g, '{')
      .replace(/\}\;/g, '}')
      .replace(/DOT/gi, ',');
    // let _css_ = JSON.stringify(obj).trim()
    //   .replace(/^\{|\"|\}$/g, '')
    //   .replace(/\,|\}|\:\{|\}\;|DOT/gi,  function (e) {
    //   let rule = {
    //     ',': ';',
    //     '}': ';}',
    //     ':{': '{',
    //     '};': ','
    //   };
    //   return rule[e]
    // });
    // console.log(`new _css : `, _css);
    // console.log(`new _css_ : `, _css_);
    return _css;
  };

  /**
   * The method will make camel variable transform underline variable
   * @param obj
   * @returns {void | string | *}
   */
  personalWindow.camel2underline = function (obj) {
    return obj.replace(/([A-Z])/g, d => {
      return '_' + d.toLowerCase()
    })
  };

  /**
   * Making variable transform class variable
   * @param box
   * @returns {*[]}
   */
  personalWindow.variable2class = function (box) {
    let keys = Object.keys(box);
    for (let i in keys) {
      box[keys[i]]['class'] = '.' + box[keys[i]].getAttribute('class');
    }
    return box
  };

  return async function (type, title, des, cancel, ensure) {
    type = type || ''; // window type. At present, only support warning\success\shutdown\restart
    title = title || ''; // pop title
    des = des || 'Hi！May I ask if you forgotten something？'; // confirm info
    cancel = cancel || 'cancel'; // cancel button info
    ensure = ensure || 'ensure'; // ensure button info
    return await personalWindow({
      type: type,
      title: title,
      des: des,
      cancel: cancel,
      ensure: ensure
    })
  }
})(window, document);
