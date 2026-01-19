#include <bits/stdc++.h>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> mp;
    for (int i = 0; i < (int)nums.size(); i++) {
        int need = target - nums[i];
        if (mp.count(need)) return {mp[need], i};
        mp[nums[i]] = i;
    }
    return {};
}

// ✅ parse input like: nums = [2,7,11,15], target = 9
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    string s;
    getline(cin, s);

    // Extract array part inside []
    int l = s.find('[');
    int r = s.find(']');
    string arrStr = s.substr(l + 1, r - l - 1);

    // Extract target number after "target ="
    int pos = s.find("target");
    int eq = s.find("=", pos);
    string targetStr = s.substr(eq + 1);
    int target = stoi(targetStr);

    // Parse numbers from array string
    vector<int> nums;
    stringstream ss(arrStr);
    string token;

    while (getline(ss, token, ',')) {
        nums.push_back(stoi(token));
    }

    vector<int> ans = twoSum(nums, target);

    // print output like [0,1]
    cout << "[" << ans[0] << "," << ans[1] << "]";
    return 0;
}
