    var markerValue = 'hospital';
        //Knockout viewmodel used to update wikipedia links and marker list automaticaly
    var viewModel = function() {
        var self = this;
        self.name = ko.observable("vasudev");
        self.link = ko.observableArray();
        self.src = ko.observableArray();
        self.marker = ko.observableArray();
        this.markerFilters = ko.observableArray([
        {'name':"< 1 Km", 'Id':"1000" },
        {'name':"< 3 Km", 'Id':"3000" },
        {'name':"< 5 Km", 'Id':"5000" },
        {'name':"< 8 Km", 'Id':"8000" },
        {'name':"< 10 Km", 'Id':"10000" }
        ]);
        this.selectedFilter = ko.observable();

        self.addItem = function() {
            var address = document.getElementById('area-text').value;
            var wikiInput = address.split(", ");
            var wikiUrl = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + wikiInput[0] + "&format=json&callback=wikiCallback";
            console.log(wikiUrl);
            var wikiTimeout = setTimeout(function() {
                $('#wikipedia').text('Failed to get Wiki Resources');
            }, 8000);
            $.ajax(wikiUrl, {
                dataType: 'jsonp',
                success: function(data) {
                    self.link(data[1]);
                    self.src(data[3]);
                    clearTimeout(wikiTimeout);
                }
            });
        };
        self.wikiFirst = function() {
            if (userLocalAddr === '') {
                 address = 'Bangalore';
            } else {
                 address = userLocalAddr;
            }
            var wikiUrl = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" +
                address + "&format=json&callback=wikiCallback";
            var wikiTimeout = setTimeout(function() {
            $('#wikipedia').text('Failed to get Wiki Resources');
            }, 8000);
            $.ajax(wikiUrl, {
                dataType: 'jsonp',
                success: function(data) {
                    self.link(data[1]);
                    self.src(data[3]);
                    clearTimeout(wikiTimeout);
                }
            });
        };
        //remove all item from marker list
        self.removeList = function() {
                self.marker.removeAll();
                var pos = getplace();
                findPlaces(markerValue, pos, this.selectedFilter());
            };
        //add all marker name to marker array
        self.addMarkerName = function() {
                    self.marker(markerName);
        };
        self.onWikiclick = function() {
            self.marker.removeAll();
            userArea();
            self.addItem();
        };
        //call wikipedia API first time after load
        setTimeout(function() {
            self.wikiFirst();
        }, 5000);
        //toggle nav
        self.toggleNav = function(){
            document.getElementById("Nav").classList.toggle("open");
        };
        //Toggle the nav when clicked on map
        self.mapNav = function(){
            if ($("#Nav").hasClass("open")) {
                document.getElementById("Nav").classList.toggle("open");
            }
        };
    };
    ko.applyBindings(new viewModel());

        // function to place info window requested
        // from list in navigation
    var infoDisplay = function(value) {
            callFromList(value);
            if ($("#Nav").hasClass("open")) {
                document.getElementById("Nav").classList.toggle("open");
            }
        };