#include <bits/stdc++.h>
using namespace std;

#define fast_io ios::sync_with_stdio(false); cin.tie(nullptr); cout.tie(nullptr);
#define ll long long ;
#define el '\n'
#define fi first ;
#define se second ;
const int MOD = 1e9 + 7; 

int cntBit (string a , string b) {
    int cnt = 0 ;
    for(int i = 0 ; i < a.size() ; i++){
        if (a[i] != '1' || b[i] != '1') cnt++ ;
    }
    return cnt ;
}
void solve() {
    int n ; cin >> n ;
    string a[n] ;
    for(int i = 0 ; i < n ; i++){
        cin >> a[i] ;
    }

    map<int,int> mp ;
    for (int i = 0 ; i < n ; i++) {
        for (int j = i+1 ; j < n ; j++) {
            mp[cntBit(a[i],a[j])]++;
        }
    }

    int ans = -1 , cnt = 0 ;
    for (auto x : mp) {
        if (x.fi > ans) {
            ans = x.fi ;
            cnt = x.se ;
        }
    }

    cout << ans << " " << cnt << el ;


}

int main() {
    fast_io;
    solve(); 
    

    return 0;
}