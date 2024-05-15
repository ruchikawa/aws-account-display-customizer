document.addEventListener('DOMContentLoaded', function() {
  // 保存されたマッピングを取得して表示する関数
  function displayMappings() {
    chrome.storage.sync.get('roleMappings', function(data) {
      const roleMappings = data.roleMappings || {};
      const mappingsList = document.getElementById('mappingsList');
      mappingsList.innerHTML = '';

      for (const accountId in roleMappings) {
        const li = document.createElement('li');
        li.className = 'mapping-item';
        li.innerHTML = `
          <span>${accountId}: ${roleMappings[accountId]}</span>
          <button class="delete" data-account-id="${accountId}">Delete</button>
        `;
        mappingsList.appendChild(li);
      }

      // 削除ボタンにイベントリスナーを追加
      document.querySelectorAll('.delete').forEach(button => {
        button.addEventListener('click', function() {
          const accountIdToDelete = this.getAttribute('data-account-id');
          deleteMapping(accountIdToDelete);
        });
      });
    });
  }

  // マッピングを削除する関数
  function deleteMapping(accountId) {
    chrome.storage.sync.get('roleMappings', function(data) {
      const roleMappings = data.roleMappings || {};
      delete roleMappings[accountId];

      chrome.storage.sync.set({ roleMappings: roleMappings }, function() {
        displayMappings();
      });
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
