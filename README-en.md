# pop-up-box
This is a custom popup plugin that USES pure JS development, meaning that your project files can be used as long as they allow you to import JS files.

## Import
At present, we provide two import modes for small masters:

NO1、Install the plug-in via `npm install pxu`

NO2、By downloading the JS plug-in
> The js plugin can only be downloaded from the Clone Github repository or directly copied from the contents of the `index.js` file in the current project
>
> If you are not interested in the source code, you can switch to the dev branch and download or copy the `index.js` in the `dist` folder.

## Usage
```
 * The example of confirm$ usage mode
 * pxu($1, $2, $3, $4, $5)
 * $1 : represents the `type` of pop-up box(icon)
 * $2 : represents the `title` of pop-up box
 * $3 : represents the `description` of pop-up box.The description can be html
 *      but must had `id="pxu"` attribute in input html.Example:
 *      <input id="pxu" type="text" placeholder="Please enter your login password" style="..." />
 * $4 : represents the `cancel button` of pop-up box
 * $5 : represents the `ensure button` of pop-up box
 *  pxu(null,
    'Are you sure to continue the restart？',
    'Please make sure that your information is filled in correctly and cannot be modified after submission',
    'cancel',
    'ensure').then(res => {
 *    console.log(res)
 *  });
```

## Result
If you want to see effect img, you can **switch dev** to see
