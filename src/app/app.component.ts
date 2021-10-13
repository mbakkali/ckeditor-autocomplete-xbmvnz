import { Component, VERSION } from "@angular/core";
import { CKEditor4 } from "ckeditor4-angular/ckeditor";

declare const CKEDITOR;

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  public editorConfig: any = {};
  public editorValue: any = "<p>Hello, world!</p>";
  public placeHolderObj = [
    {
      id: 1,
      name: "address",
      title: "Address",
      description: "Customer Support correspondence address."
    },
    {
      id: 2,
      name: "assignee",
      title: "Assignee Name",
      description: "Ticket assignee name."
    },
    {
      id: 3,
      name: "deadline",
      title: "Deadline Time",
      description: "Utmost time to which technician should handle the issue."
    },
    {
      id: 4,
      name: "department",
      title: "Department Name",
      description: "Department name responsible for servicing this ticket."
    }
  ];
  constructor() {}
  public configOption = () => {
    return (this.editorConfig = {
      plugins: "autocomplete,textmatch",
      on: {
        instanceReady: function(event) {
          console.log(event);
          const itemTemplate =
            '<li data-id="{id}">' +
            '<div><strong class="item-title">{title}</strong></div>' +
            "<div><i>{description}</i></div>" +
            "</li>";
          const outputTemplate = "[[{title}]]<span>&nbsp;</span>";
          const autocomplete = new CKEDITOR.plugins.autocomplete(event.editor, {
            textTestCallback: this.textTestCallback,
            dataCallback: this.dataCallback,
            itemTemplate: itemTemplate,
            outputTemplate: outputTemplate
          });

          // Override default getHtmlToInsert to enable rich content output.
          autocomplete.getHtmlToInsert = function(item) {
            return this.outputTemplate.output(item);
          };
        }
      }
    });
  };

  public textTestCallback = range => {
    console.log("range", range);
    if (!range.collapsed) {
      return null;
    }
    return CKEDITOR.plugins.textMatch.match(range, this.matchCallback);
  };

  public matchCallback = (text, offset) => {
    const pattern = /\[{2}([A-z]|\])*$/;
    const match = text.slice(0, offset).match(pattern);
    if (!match) {
      return null;
    }
    return { start: match.index, end: offset };
  };

  public dataCallback = (matchInfo, callback) => {
    const data = this.placeHolderObj.filter(function(item) {
      const itemName = "[[" + item.name + "]]";
      return itemName.indexOf(matchInfo.query.toLowerCase()) == 0;
    });
    callback(data);
  };

  handleEditorData = event => {
    // console.log(event.editor.getData())
  };
}
