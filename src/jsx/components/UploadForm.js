import "./UploadForm.js";
import {useContext} from "react";

function UploadForm() {
    return(
      <form action="" method="POST" enctype="multipart/form-data">
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" name="name" required/>

        <label htmlFor="description">Description:</label>
        <textarea id="description" name="description" rows="5" required></textarea>

        <label htmlFor="expiration">Expiry date:</label>
        <input type="date" id="expiration" name="expiration" required/>

          <label htmlFor="status">Status:</label>
          <select id="status" name="status" required>
              <option value="Brand new">Brand new</option>
              <option value="Some wear and tear">Some wear and tear</option>
              <option value="Not very good">Not very good</option>
          </select>

          <label htmlFor="location">Location:</label>
          <input type="text" id="location" name="location" required/>

          <label htmlFor="image">Pic:</label>
          <input type="file" id="image" name="image" accept="image/*" required/>

          <button type="submit">Submit</button>
      </form>
    );
}

export default UploadForm;