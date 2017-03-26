/*
 *  Digitally Imported plugin for Movian Media Center
 *
 *  Copyright (C) 2012-2015 Henrik Andersson, lprot
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

(function(plugin) {
  var logo = plugin.path + 'di.svg';
  var PREFIX = "di:";

  var non_working = {
    indiebeats: true,
    electro: true,
    glitchhop: true,
    classictechno: true,
    detroithousentechno: true,
    electronics: true,
    ebm: true,
    drumstep: true,
    electronicpioneers: true,
    darkpsytrance: true,
    idm: true,
    futurebeats: true,
  };


  plugin.createService(plugin.getDescriptor().title, plugin.getDescriptor().id + ':start', 'music', true, logo);

  plugin.addURI(PREFIX+"channel:(.*)", function(page, name) {
	//page.type="video";
	//page.metadata.title = name;
    var videoParams = {
      title: name,
      icon: "http://7xs8go.com1.z0.glb.clouddn.com/semantic.jpg",
      canonicalUrl: PREFIX + 'video:' + name,
      sources: [{
        url: 'http://pub2.diforfree.org:8000/di_'+ name + '_hi',
        mimetype: "xx",
      }],
      no_subtitle_scan: true,
      subtitles: []
    }
    page.source = 'audioparams:' + JSON.stringify(videoParams);
  }); 

  plugin.addURI(PREFIX+"BrowsebyArtist", function(page) {
   // page.type = 'directory';
    page.model.contents = 'grid';

  //  page.metadata.icon = logo;
  //  page.metadata.title = plugin.getDescriptor().title;
    page.loading = true;
    var doc = showtime.httpReq('http://www.di.fm/channels').toString().match(/start\(([\S\s]*?)\);/)[1];
    page.loading = false;
    var json = showtime.JSONDecode(doc);

    var channels = json.channels.filter(function(x) { return !(x.key in non_working);});

    channels.sort(function (a, b) { return a.key.localeCompare(b.key);});

    for (var i in channels) {
      var entity = channels[i];
      var icon = entity.images.default.match(/(^[^\{]*)/)[1];
      page.appendItem(PREFIX+ "channel:" + entity.key, 'video', {
    title: entity.key,
	description: entity.description_short,
	icon: icon.substr(0, 4) == 'http' ? icon : 'http:' + icon + '?size=150x150',
	album: ''
      });
    };
    page.metadata.title = channels[0].key;
  });

  plugin.addURI(PREFIX+"ppp", function(page) {
	  page.metadata.title = "pxpxpx";
      page.appendItem(PREFIX + 'BrowsebyArtist', 'directory',{title: "Browse by Artist" });
  }); 

  plugin.addURI(plugin.getDescriptor().id + ':start', function(page) {
	  page.metadata.title = "start";
      page.appendItem(PREFIX + 'ppp', 'directory',{title: "ppp" });
  }); 

})(this);
