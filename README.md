# locateyourseat
An easy-to-use digital seating chart that lets guests quickly find their assigned table at large events.

## Features

- 🔍 **Quick Search**: Guests can search for their name to instantly find their assigned table
- 📊 **Visual Seating Chart**: Interactive table layout showing all available tables
- 📋 **Guest List**: Complete list of all guests with their table assignments
- 🎯 **Table Highlighting**: Selected tables are highlighted for easy identification
- 📱 **Responsive Design**: Works seamlessly on mobile devices and desktop computers
- 🎨 **Professional Design**: Clean, modern interface that's easy to navigate

## How to Use

### For Event Attendees

1. Open `index.html` in any web browser
2. Type your name in the search box
3. Your table number will be displayed, and the table will be highlighted on the chart
4. Click on any table in the chart to see all guests seated there

### For Event Organizers

#### Customizing the Seating Data

Edit the `seating-data.js` file to customize the seating arrangement for your event:

1. **Update Event Name**: Change the `eventName` property
2. **Configure Tables**: Modify the `tables` array:
   ```javascript
   { number: 1, capacity: 8, x: 0, y: 0 }
   ```
   - `number`: Table number
   - `capacity`: Maximum number of seats
   - `x`, y`: Position in the layout (optional, for future enhancements)

3. **Add Guests**: Update the `guests` array:
   ```javascript
   { name: "Guest Name", table: 1 }
   ```

#### Deployment

Simply upload all files to any web server or hosting service:
- `index.html`
- `styles.css`
- `app.js`
- `seating-data.js`

No build process or server-side code required!

## Browser Compatibility

Works with all modern browsers:
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

MIT License - feel free to use and customize for your events!
