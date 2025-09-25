package com.drivethru.service.configuration;

import com.drivethru.service.dto.AuthSession;
import com.drivethru.service.entity.UserDetail;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtHelper {

    @Value("${security.jwt.secret-key}")
    private String secretKey;

    @Value("${security.jwt.expiration-time}")
    private long jwtExpiration;

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String generateToken(UserDetail user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getUserId());
        claims.put("email", user.getEmail());
        claims.put("name", user.getFirstName() + " " + user.getSurName());
        claims.put("tenantId", user.getTenantId());
        claims.put("roleId", user.getRoleId());
        claims.put("siteId",user.getSiteId());
        return buildToken(claims, user.getEmail());
    }

    private String buildToken(Map<String, Object> claims, String subject) {
        Date now = new Date();
        Date expiration = new Date(now.getTime() + jwtExpiration * 1000);

        return Jwts.builder().setClaims(claims).setSubject(subject).setIssuedAt(now).setExpiration(expiration).signWith(getSignInKey(), SignatureAlgorithm.HS512).compact();
    }

    public boolean isTokenValid(String token, UserDetail user) {
        final String username = extractUsername(token);
        return (username.equals(user.getEmail()) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        Date expiration = extractExpiration(token);
        return expiration.before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser().setSigningKey(getSignInKey()).build().parseClaimsJws(token).getBody();
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public AuthSession parseToken(String token) {
        Claims body = extractAllClaims(token);

        AuthSession authSession = new AuthSession();
        authSession.setEmail(body.getSubject());

        Object userIdObj = body.get("userId");
        if (userIdObj != null) {
            authSession.setUserId(Integer.parseInt(userIdObj.toString()));
        }

        return authSession;
    }
    public String extractUserId(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

        Integer userId = claims.get("userId", Integer.class);
        return userId != null ? userId.toString() : null;
    }
    public String extractSiteId(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

        Integer siteId = claims.get("siteId", Integer.class);
        return siteId != null ? siteId.toString() : null;
    }

    public String cleanToken(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return authHeader;
    }
}
