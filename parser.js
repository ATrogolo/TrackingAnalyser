  (function ($, md5) {
    var searchpgUrl = '';
    var accessTokenMd5 = '281ff487df6d415a06300b9d9569b5bd';
    var authPassword = null;
    var INTERVAL = 250;
    var stopScan = false;

    function buildParams(item) {
      var params = {
        client: 'pgmobile',
        device: 'iPhone',
        version: '5.0.3',
        output: 'jsonp'
      };

      if (item.COSA != undefined && item.COSA != null) {
        params.what = item.COSA;
      }
      if (item.DOVE != undefined && item.DOVE != null) {
        params.where = item.DOVE;
      }
      if (item.X != undefined && item.X != null) {
        params.lat = item.X;
      }
      if (item.Y != undefined && item.Y != null) {
        params.lon = item.Y;
      }
      return params;
    };

    function buildOutputUrl(params) {
      var qs = "";

      for (var key in params) {
        qs += "&" + key + '=' + params[key];
      }
      qs = qs.slice(1);

      return searchpgUrl + '?' + qs;
    };

    function updateCounters(listItem) {
      var $scope = $('#resultsTable');
      var htmlSpan = $scope.find(listItem + ' > .counter');
      var counter = parseInt(htmlSpan.html());

      htmlSpan.html(counter + 1);

      $('.computed').html(parseInt($('.computed').html()) + 1);
    };

    function updateList(list, json) {
      var $elem = $(list);
      var htmlTag = '<li><a target="_blank" href="';

      var url = buildOutputUrl(json.request.params.params);

      $elem.append(htmlTag + url + '">' + url + '</a></li>');
    };

    function exportData() {
      var data = {
        counters: {}
      };
      var listNumber = $('.lists > ol').length;
      var $resultsTableRows = $('#resultsTable tbody tr');

      for (var i = 0; i < listNumber; i++) {
        var $list = $($('.lists > ol')[i]);
        label = $list.attr('id');
        data[label] = [];
        var $cols = $($resultsTableRows[i]).find('td');

        data.counters[$($cols[0]).html()] = $($cols[1]).html();

        $list.find('li').each(function (index) {
          data[label].push($(this).text());
        });
      }

      var url = 'data:text/json;charset=utf8,' + encodeURIComponent(JSON.stringify(data, null, 4));
      $('.export-data').attr('href', url);
    };

    function handleFileSelection(event) {
      if (event == null || event.target == null || event.target.files == null || event.target.files.length < 0) return;
      // if (authPassword == null || accessTokenMd5 !== md5(authPassword)) {
      //   alert('Auth required!');
      //   return;
      // }

      var file = event.target.files[0];
      var reader = new FileReader();

      reader.onload = function (e) {
        try {
          if(searchpgUrl.indexOf('mobile') == -1){
            alert('Mwrapper URL not setted!');
            return;
          }
          var data = JSON.parse(e.target.result);
          $('.resultsSection').removeClass('hidden');
          $('.stop-scan').removeClass('hidden');
          analyseData(data);
        } catch (err) {
          alert('An error has occurred!');
          return;
        }
      };
      reader.onerror = function (e) {
        alert('An error has occurred!');
        return;
      };

      reader.readAsText(file);
    };

    function analyseData(data) {
      var i = 0;
      $('.test-status').removeClass('hidden');
      $('.total').html(data.length);

      var timeoutId = setInterval(function () {
        if (i < data.length && !stopScan) {
          var item = data[i];

          $.ajax({
            url: searchpgUrl,
            type: "GET",
            dataType: "jsonp",
            async: true,
            data: buildParams(item),
            timeout: 5000,
            success: function (json) {
              if (json.status == 200) {
                if (json.resultsNumber > 0) {
                  updateCounters('#searchesWithResults');
                  updateList('#resultsList', json);
                } else {
                  updateCounters('#searchesWithNoResults');
                  updateList('#noResultsList', json);
                }
              } else if (json.status.charAt(0) === '3') {
                updateCounters('#ambiguitySearches');
                updateList('#ambiguityList', json);
              } else if (json.status.charAt(0) === '4') {
                updateCounters('#wrongSearches');
                updateList('#wrongList', json);
              }
            },
            error: function (jqXHR, textStatus, errorThrown) {
              updateCounters('#errors');
              updateList('#errorList', json);
            }
          });
          i++;
        } else {
          // test completed
          clearInterval(timeoutId);
          exportData();
          $('.loading').addClass('stop');
          $('.test-running').hide();
          $('.test-completed').removeClass('hidden');
          $('.export-data').removeClass('hidden');
          $('.cleanup').removeClass('hidden');
          $('.stop-scan').addClass('hidden');
        }
      }, INTERVAL);
    };

    function setMwrapperUrl(event){
      searchpgUrl = event.target.value.trim();
      if(!searchpgUrl.endsWith('/'))
        searchpgUrl += '/'

      searchpgUrl += "searchpg";
    }

    function authUser(event) {
      event.preventDefault();
      var password = $('#auth').val();

      if (password == null || password.length == 0) {
        alert('Authentication first!');
      } else if (md5(password) === accessTokenMd5) {
        authPassword = password;
        sessionStorage.setItem('authPassword', password);
        $('.passwordSection').toggleClass('hidden');
        $('.inputSection').toggleClass('hidden');
        $('.wrong-password').addClass('hidden');
      } else {
        // Wrong password
        $('.wrong-password').removeClass('hidden');
      }
    };

    function blockScan(event) {
      event.preventDefault();
      stopScan = true;
    };

    function reload(event) {
      event.preventDefault();
      location.reload();
    };

    // Check for the various File API support.
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      $('#files').on('change', handleFileSelection);
    } else {
      alert('The File APIs are not fully supported in this browser. Please use Chrome or update it.');
    }

    if (sessionStorage.getItem('authPassword') != null) {
      authPassword = sessionStorage.getItem('authPassword');
      $('.passwordSection').toggleClass('hidden');
      $('.inputSection').toggleClass('hidden');
    }

    $('#mwrapperUrl').on('keyup', setMwrapperUrl);
    $('#authBtn').on('click', authUser);
    $('.passwordBox').on('submit', authUser);
    $('.stop-scan').on('click', blockScan);
    $('.cleanup').on('click', reload);

  })(jQuery, md5);
