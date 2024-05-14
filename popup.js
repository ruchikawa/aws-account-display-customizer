document.addEventListener('DOMContentLoaded', function() {
    // 保存されたマッピングを取得して表示する関数
    function displayMappings() {
      chrome.storage.sync.get('roleMappings', function(data) {
        const roleMappings = data.roleMappings || {};
        const mappingsList = document.getElementById('mappingsList');
        mappingsList.innerHTML = '';
  
        for (const accountId in roleMappings) {
          const li = document.createElement('li');
          li.textContent = `${accountId}: ${roleMappings[accountId]}`;
          mappingsList.appendChild(li);
        }
      });
    }
  
    // 保存ボタンのクリックイベント
    document.getElementById('save').addEventListener('click', function() {
      const accountId = document.getElementById('accountId').value;
      const roleName = document.getElementById('roleName').value;
  
      if (accountId && roleName) {
        chrome.storage.sync.get('roleMappings', function(data) {
          const roleMappings = data.roleMappings || {};
          roleMappings[accountId] = roleName;
  
          chrome.storage.sync.set({ roleMappings: roleMappings }, function() {
            document.getElementById('status').textContent = 'Saved!';
            setTimeout(function() {
              document.getElementById('status').textContent = '';
            }, 2000);
  
            displayMappings();
          });
        });
      }
    });
  
    // ページ読み込み時にマッピングを表示
    displayMappings();
  });
  