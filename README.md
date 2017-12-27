# TrackingAnalyser

This simple project was built to analyse tracking information, categorizing them.

## Usage

1. Launch index.html
2. Insert the required password (email me for more information about this)
3. Set the Mwrapper hostname (eg. <http://mwrapperHostname.url>)
4. Load a JSON input file where tracking information are stored
5. The scan will then start ... wait until it ends

### Mwrapper URL

This is the URL where the Mwrapper webservice lives on. Email me for more details about this URLs (different for various environments)

### JSON Input file

The JSON input file is a subset of information stored on an Excel file. I get only relevant ones and convert the Excel in the JSON format. JSON file has fixed structure: an array of different tracking information, as described here:

```json
[
   {
      "PAG":"LISTING_Q",
      "ACTION":"ERRORE_7",
      "COSA":" pizza",
      "DOVE":"Milano (MI)",
      "X":null,
      "Y":null
   },
   {
      "PAG":"LISTING_Q",
      "ACTION":"ERRORE_7",
      "COSA":" bricofer",
      "DOVE":"",
      "X":37.646496,
      "Y":12.613477
   }
]
```

### Results

Results are presented in a simple table where success / errors are highlighted. If you're interested in Mwrapper responses you can click on links reported in the page to see them. When the analysis is over you can export results presented in the page in JSON format using the **EXPORT DATA** button.
