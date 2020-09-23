const electron = require('electron')
const url = require('url')
const path = require('path')


const {app, BrowserWindow, Menu, ipcMain} = electron

//SEt ENV
//process.env.NODE_ENV = 'production'


let mainWindow
let addWindow

app.on('ready', function(){
    mainWindow = new BrowserWindow({
        width: 900,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))
    //close app when closed
    mainWindow.on('closed', function(){
        app.quit()
    })
    //build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
    //insert menu
    Menu.setApplicationMenu(mainMenu)

     // Отображаем средства разработчика.
    mainWindow.webContents.openDevTools()
})

function createAddWindow(){
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Adding',
        
        webPreferences: {
            nodeIntegration: true
        }
    })
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol: 'file:',
        slashes: true
    }))

    addWindow.on('close', function(){
        addWindow = null
    })
}

//Catch item:add
ipcMain.on('item:add', function(e, item){
    console.log(item)
    mainWindow.webContents.send('item:add', item)
    addWindow.close()
})

const mainMenuTemplate = [
    {
        label: 'File',
        submenu:[
            {
                label: 'Add Item',
                click(){
                    createAddWindow();
                }
            },
            {
                label: 'Clear Items',
                click(){
                    mainWindow.webContents.send('item:clear')
                }
            },
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'command+Q' : 'Ctrl+Q',
                click(){
                    app.quit()
                }
            }
        ]
    }
];

if(process.platform == 'darwin'){
    mainMenuTemplate.unshift({})
}

//Add devtools
if(process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label: 'Dev',
        submenu: [
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'command+I' : 'Ctrl+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools()
                }
            },
            {
                role: 'reload'
            }
        ]
    })
}